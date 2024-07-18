import type { PayloadRequest } from 'payload/types'
import jwt from 'jsonwebtoken'
import { getCookieExpiration } from 'payload/auth'
import { cookies } from 'next/headers'
import type { SessionOptions, Oauth2AccountInfo, OAuth2ProviderConfig } from '../../types'

export async function oauth2Session(
  request: PayloadRequest,
  providerConfig: OAuth2ProviderConfig,
  sessionOptions: SessionOptions,
  accountInfo: Oauth2AccountInfo,
): Promise<Response> {
  const { payload } = request
  const { usersCollectionSlug, accountsCollection, successRedirect, failureRedirect } =
    sessionOptions

  const usersSlug = usersCollectionSlug ?? 'users'
  const accountsSlug = accountsCollection?.slug ?? 'accounts'
  const accountsCollectionConfig = payload.collections[accountsSlug].config

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
      throw Error("User doesn't exist")
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

  return Response.redirect('http://localhost:3000/admin')
}
