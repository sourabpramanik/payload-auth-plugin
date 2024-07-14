'use server'

import { type PayloadRequest } from 'payload/types'
import { cookies } from 'next/headers'
import * as oauth from 'oauth4webapi'
import jwt from 'jsonwebtoken'
import { getCookieExpiration } from 'payload/auth'
import type { ProviderClientConfig } from '../types'

export async function createSession(
  req: PayloadRequest,
  accountsCollectionSlug: string,
  usersCollectionSlug: string,
  provider: ProviderClientConfig,
  redirectPaths: {
    successPath: string
    failurePath: string
  },
): Promise<Response> {
  const session_cookie = cookies().get('session-token')
  if (!session_cookie) {
    throw new Error('Session not found')
  }

  const successURL = new URL(req.url as string)
  successURL.pathname = redirectPaths.successPath
  successURL.search = ''

  const failureURL = new URL(req.url as string)
  failureURL.pathname = redirectPaths.failurePath
  failureURL.search = ''

  const { payload } = req

  const account_sub = provider.provider_sub ?? 'sub'

  const accountsCollectionConfig = payload.collections[accountsCollectionSlug].config
  const authorization_server = provider.authorization_server
  const client: oauth.Client = {
    client_id: provider.client_id,
    client_secret: provider.client_secret,
    token_endpoint_auth_method: 'client_secret_basic',
  }

  const account_info: oauth.UserInfoResponse = await (
    await oauth.userInfoRequest(authorization_server, client, session_cookie.value)
  ).json()

  const account_record = await payload.find({
    collection: accountsCollectionSlug,
    where: {
      sub: { equals: account_info[account_sub] },
    },
    showHiddenFields: true,
  })

  let user_id = ''

  if (account_record?.docs?.length) {
    await payload.update({
      collection: accountsCollectionSlug,
      where: {
        id: { equals: account_record.docs[0].id },
      },
      data: {
        access_token: session_cookie.value,
        scope: provider.scope,
        name: account_info.name,
        picture: account_info.picture ?? (account_info?.avatar_url as string),
      },
      showHiddenFields: true,
    })
    const user = await payload.find({
      collection: usersCollectionSlug,
      where: {
        email: { equals: account_info.email as string },
      },
    })
    user_id = user.docs[0].id as string
  } else {
    const user = await payload.find({
      collection: usersCollectionSlug,
      where: {
        email: { equals: account_info.email as string },
      },
    })

    if (!user.docs || user.docs.length === 0) {
      return Response.redirect(failureURL.toString())
    }
    user_id = user.docs[0].id as string

    await payload.create({
      collection: accountsCollectionSlug,
      data: {
        sub: account_info[account_sub].toString(),
        access_token: session_cookie.value,
        provider: provider.displayName,
        scope: provider.scope,
        name: account_info.name,
        picture: account_info.picture ?? (account_info?.avatar_url as string),
        user: user.docs[0].id,
      },
    })
  }

  const fieldsToSign = {
    id: user_id,
    email: account_info.email,
    collection: usersCollectionSlug,
  }

  const expiration = getCookieExpiration({
    seconds: accountsCollectionConfig.auth.tokenExpiration,
  })

  const token = jwt.sign(fieldsToSign, payload.secret, {
    expiresIn: new Date(expiration).getTime(),
  })

  cookies().set(`${payload.config.cookiePrefix}-token`, token, {
    path: '/',
    httpOnly: true,
    expires: expiration,
    secure: false,
    sameSite: 'lax',
  })

  return Response.redirect(successURL.toString())
}
