import * as oauth from 'oauth4webapi'
import type { PayloadRequest } from 'payload'
import { cookies } from 'next/headers'
import type { OIDCProviderConfig } from '../../types'
import { getCallbackURL } from '../utils/cb'

export async function OIDCAuthorization(
  request: PayloadRequest,
  providerConfig: OIDCProviderConfig,
): Promise<Response> {
  const callback_url = getCallbackURL(request)
  const code_verifier = oauth.generateRandomCodeVerifier()
  const code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier)
  const code_challenge_method = 'S256'
  const { client_id, client_secret, issuer, algorithm, scope } = providerConfig

  const client: oauth.Client = {
    client_id,
    client_secret,
    token_endpoint_auth_method: 'client_secret_basic',
  }

  const as = await oauth
    .discoveryRequest(issuer, { algorithm })
    .then(response => oauth.processDiscoveryResponse(issuer, response))

  const cookieMaxage = new Date(Date.now() + 300 * 1000)

  const authorizationURL = new URL(as.authorization_endpoint!) // eslint-disable-line
  authorizationURL.searchParams.set('client_id', client.client_id)
  authorizationURL.searchParams.set('redirect_uri', callback_url.toString())
  authorizationURL.searchParams.set('response_type', 'code')
  authorizationURL.searchParams.set('scope', scope as string)
  authorizationURL.searchParams.set('code_challenge', code_challenge)
  authorizationURL.searchParams.set('code_challenge_method', code_challenge_method)

  if (as.code_challenge_methods_supported?.includes('S256') !== true) {
    const nonce = oauth.generateRandomNonce()
    authorizationURL.searchParams.set('nonce', nonce)

    cookies().set('payload_auth_nonce', nonce, {
      expires: cookieMaxage,
      path: '/',
      httpOnly: true,
    })
  }

  cookies().set('payload_auth_code_verifier', code_verifier, {
    expires: cookieMaxage,
    path: '/',
    httpOnly: true,
  })

  return Response.redirect(authorizationURL.href)
}
