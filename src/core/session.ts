'use server'

import { fieldAffectsData, fieldHasSubFields, type PayloadRequest } from 'payload/types'
import { cookies } from 'next/headers'
import * as oauth from 'oauth4webapi'
import { nanoid } from 'nanoid'
import jwt from 'jsonwebtoken'
import { getCookieExpiration } from 'payload/auth'
import type { ProviderClientConfig } from '../types'

export async function createSession(
  req: PayloadRequest,
  collectionSlug: string,
  sub: string,
  provider: ProviderClientConfig,
  redirectPaths: {
    successRedirect: string
    failureRedirect: string
  },
): Promise<Response> {
  const session_cookie = cookies().get('__session-token')
  if (!session_cookie) {
    throw new Error('Session not found')
  }

  const { payload } = req

  const collectionConfig = payload.collections[collectionSlug].config
  const authorization_server = provider.authorization_server
  const client: oauth.Client = {
    client_id: provider.client_id,
    client_secret: provider.client_secret,
    token_endpoint_auth_method: 'client_secret_basic',
  }

  const userInfo: oauth.UserInfoResponse = await (
    await oauth.userInfoRequest(authorization_server, client, session_cookie.value)
  ).json()

  const users: Record<'docs', Array<{ email: string; name: string }>> = await payload.find({
    collection: collectionSlug,
    where: { [sub]: { equals: userInfo[provider.provider_sub] } },
    showHiddenFields: true,
  })
  let user: {
    collection: string
    id: string
    email: string
    name: string
    sub: string
  } = {
    collection: '',
    id: '',
    name: '',
    email: '',
    sub: '',
  }

  if (users.docs && users.docs.length) {
    user = { ...user, ...users.docs[0] }
    user = await payload.update({
      collection: collectionSlug,
      id: user.id,

      data: userInfo,
      showHiddenFields: true,
    })

    user.collection = collectionSlug
  } else {
    user = await payload.create({
      collection: collectionSlug,
      data: {
        ...userInfo,

        password: nanoid(),
      },
      showHiddenFields: true,
    })
    user.collection = collectionSlug
  }

  const fieldsToSign = collectionConfig.fields.reduce(
    (signedFields, field: Field) => {
      const result = {
        ...signedFields,
      }

      if (!fieldAffectsData(field) && fieldHasSubFields(field)) {
        field.fields.forEach(subField => {
          if (fieldAffectsData(subField) && subField.saveToJWT) {
            result[subField.name] = user[subField.name]
          }
        })
      }

      if (fieldAffectsData(field) && field.saveToJWT) {
        result[field.name] = user[field.name]
      }

      return result
    },
    {
      email: user.email,
      id: user.id,
      collection: collectionConfig.slug,
    } as any,
  )

  const token = jwt.sign(fieldsToSign, payload.secret, {
    expiresIn: collectionConfig.auth.tokenExpiration,
  })

  const cookieExpiration = getCookieExpiration({ seconds: collectionConfig.auth.tokenExpiration })
  cookies().set(`${payload.config.cookiePrefix}-token`, token, {
    path: '/',
    httpOnly: true,
    expires: cookieExpiration,
    secure: collectionConfig.auth.cookies.secure,
  })

  const redirect = new URL(req.url as string)
  redirect.pathname = redirectPaths.successRedirect
  redirect.search = ''

  return Response.redirect(redirect.toString())
}
