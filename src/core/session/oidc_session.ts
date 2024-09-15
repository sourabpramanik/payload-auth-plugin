import jwt from 'jsonwebtoken'
import type { PayloadRequest } from 'payload'
import { getCookieExpiration } from 'payload'
import type { AccountInfo, OIDCProviderConfig, SessionOptions } from '../../types'
import { AuthError } from '../error'

export async function oidcSession(
  request: PayloadRequest,
  providerConfig: OIDCProviderConfig,
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

  const cookies: string[] = []
  cookies.push(
    `${payload.config.cookiePrefix}-token=${token};Path=/;HttpOnly;SameSite=lax;Expires=${expiration.toString()}`,
  )
  cookies.push(`__session-oauth-nonce='';Path=/;HttpOnly;SameSite=lax;Expires=0`)
  cookies.push(`__session-code-verifier='';Path=/;HttpOnly;SameSite=lax;Expires=0`)

  const successURL = new URL(request.url as string)
  successURL.pathname = successRedirectPath
  successURL.search = ''

  const res = new Response(null, {
    status: 302,
    headers: {
      Location: successURL.href,
    },
  })

  cookies.forEach(cookie => {
    res.headers.append('Set-Cookie', cookie)
  })

  return res
}
