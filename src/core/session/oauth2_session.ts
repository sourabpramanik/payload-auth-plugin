import type { PayloadRequest } from 'payload'
import jwt from 'jsonwebtoken'
import { getCookieExpiration } from 'payload'
import { cookies } from 'next/headers'
import type { SessionOptions, OAuth2ProviderConfig, AccountInfo } from '../../types'
import { AuthError } from '../error'

export async function oauth2Session(
  request: PayloadRequest,
  providerConfig: OAuth2ProviderConfig,
  sessionOptions: SessionOptions,
  accountInfo: AccountInfo,
): Promise<Response> {
  const { payload } = request
  const { usersCollectionSlug, accountsCollection, successRedirect, errorRedirect } = sessionOptions

  const usersSlug = usersCollectionSlug ?? 'users'
  const accountsSlug = accountsCollection?.slug ?? 'accounts'
  const accountsCollectionConfig = payload.collections[accountsSlug].config
  const errorRedirectPath = errorRedirect ?? '/admin/login'
  const successRedirectPath = successRedirect ?? '/admin'

  const accountRecord = await payload.find({
    collection: accountsSlug,
    where: {
      sub: { equals: accountInfo.sub },
    },
    showHiddenFields: true,
  })

  let userId = ''
  if (accountRecord.docs.length) {
    await payload.update({
      collection: accountsSlug,
      where: {
        id: { equals: accountRecord.docs[0].id },
      },
      data: {
        scope: providerConfig.scope,
        name: accountInfo.name,
        picture: accountInfo.picture,
      },
      showHiddenFields: true,
    })
    const user = await payload.find({
      collection: usersSlug,
      where: {
        email: { equals: accountInfo.email as string },
      },
    })
    userId = user.docs[0].id as string
  } else {
    const user = await payload.find({
      collection: usersSlug,
      where: {
        email: { equals: accountInfo.email as string },
      },
    })

    if (!user.docs || user.docs.length === 0) {
      return AuthError(request, errorRedirectPath, 'User not found')
    }
    userId = user.docs[0].id as string

    await payload.create({
      collection: accountsSlug,
      data: {
        sub: accountInfo.sub,
        issuerName: providerConfig.name,
        scope: providerConfig.scope,
        name: accountInfo.name,
        picture: accountInfo.picture,
        user: userId,
      },
    })
  }

  const fieldsToSign = {
    id: userId,
    email: accountInfo.email,
    collection: usersSlug,
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

  const successURL = new URL(request.url as string)
  successURL.pathname = successRedirectPath
  successURL.search = ''
  return Response.redirect(successURL.toString())
}
