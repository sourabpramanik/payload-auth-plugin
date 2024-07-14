'use server'

import type { PayloadRequest } from 'payload/types'
import { cookies } from 'next/headers'
import * as oauth from 'oauth4webapi'
import type { ProviderClientConfig } from '../types'
import { getCallbackURL } from './utils/cb'

// class OauthError extends Error {}

export async function handleAuthorization(
  request: PayloadRequest,
  provider: ProviderClientConfig,
): Promise<Response> {
  const callback_url = getCallbackURL(request)
  const code_verifier = oauth.generateRandomCodeVerifier()
  const code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier)
  const code_challenge_method = 'S256'

  const client: oauth.Client = {
    client_id: provider.client_id,
    client_secret: provider.client_secret,
    token_endpoint_auth_method: 'client_secret_basic',
  }

  const cookieMaxage = new Date(Date.now() + 300 * 1000)

  const authorizationURL = new URL(provider.authorization_server.authorization_endpoint!) // eslint-disable-line
  authorizationURL.searchParams.set('client_id', client.client_id)
  authorizationURL.searchParams.set('redirect_uri', callback_url.toString())
  authorizationURL.searchParams.set('response_type', 'code')
  authorizationURL.searchParams.set('scope', provider.scope as string)
  authorizationURL.searchParams.set('code_challenge', code_challenge)
  authorizationURL.searchParams.set('code_challenge_method', code_challenge_method)

  if (provider.authorization_server.code_challenge_methods_supported?.includes('S256') !== true) {
    const state = oauth.generateRandomState()
    authorizationURL.searchParams.set('state', state)

    cookies().set('payload_auth_state', state, {
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

export async function handleCallback(
  request: PayloadRequest,
  provider: ProviderClientConfig,
): Promise<Response> {
  const state = cookies().get('payload_auth_state')
  const code_verifier = cookies().get('payload_auth_code_verifier')

  const client: oauth.Client = {
    client_id: provider.client_id,
    client_secret: provider.client_secret,
    token_endpoint_auth_method: 'client_secret_basic',
  }

  const current_url = new URL(request.url as string)
  const callback_url = getCallbackURL(request)

  const params = oauth.validateAuthResponse(
    provider.authorization_server,
    client,
    current_url,
    state?.value as string,
  )

  if (oauth.isOAuth2Error(params)) {
    throw new Error('Invalid params')
  }

  const response = await oauth.authorizationCodeGrantRequest(
    provider.authorization_server,
    client,
    params,
    callback_url.toString(),
    code_verifier?.value as string,
  )

  const challenges = oauth.parseWwwAuthenticateChallenges(response)

  if (challenges) {
    for (const challenge of challenges) {
      console.error('WWW-Authenticate Challenge', challenge) // eslint-disable-line
    }

    throw new Error('Failed to authenticate')
  }

  const result = await oauth[
    provider.algorithm === 'oauth2'
      ? 'processAuthorizationCodeOAuth2Response'
      : 'processAuthorizationCodeOpenIDResponse'
  ](provider.authorization_server, client, response)

  if (oauth.isOAuth2Error(result)) {
    throw new Error('Invalid response or algorithm')
  }

  return Response.json({
    message: 'yooo damn',
  })
}
