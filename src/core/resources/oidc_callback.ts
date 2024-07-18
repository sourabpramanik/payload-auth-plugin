import type { PayloadRequest } from 'payload/types'
import { cookies } from 'next/headers'
import * as oauth from 'oauth4webapi'
import type { OIDCProviderConfig } from '../../types'
import { getCallbackURL } from '../utils/cb'

export async function OIDCCallback(
  request: PayloadRequest,
  providerConfig: OIDCProviderConfig,
  session_callback: (claims: oauth.UserInfoResponse) => Promise<Response>,
): Promise<Response> {
  const nonce = cookies().get('payload_auth_nonce')
  const code_verifier = cookies().get('payload_auth_code_verifier')

  if (!code_verifier) {
    throw Error('Invalid session')
  }
  cookies().delete('payload_auth_code_verifier')
  cookies().delete('payload_auth_nonce')

  const { client_id, client_secret, issuer, algorithm } = providerConfig
  const client: oauth.Client = {
    client_id,
    client_secret,
    token_endpoint_auth_method: 'client_secret_basic',
  }

  const current_url = new URL(request.url as string)
  const callback_url = getCallbackURL(request)

  const as = await oauth
    .discoveryRequest(issuer, { algorithm })
    .then(response => oauth.processDiscoveryResponse(issuer, response))

  const params = oauth.validateAuthResponse(as, client, current_url)

  if (oauth.isOAuth2Error(params)) {
    throw new Error('Invalid params')
  }

  const response = await oauth.authorizationCodeGrantRequest(
    as,
    client,
    params,
    callback_url.toString(),
    code_verifier.value,
  )
  const challenges = oauth.parseWwwAuthenticateChallenges(response)

  if (challenges) {
    for (const challenge of challenges) {
      console.error('WWW-Authenticate Challenge', challenge) // eslint-disable-line
    }

    throw new Error('Failed to authenticate')
  }

  const token_result = await oauth.processAuthorizationCodeOpenIDResponse(
    as,
    client,
    response,
    nonce?.value as string,
  )

  if (oauth.isOAuth2Error(token_result)) {
    throw new Error('Invalid response')
  }

  const claims = oauth.getValidatedIdTokenClaims(token_result)
  const userInfoResponse = await oauth.userInfoRequest(as, client, token_result.access_token)

  if (oauth.parseWwwAuthenticateChallenges(userInfoResponse)) {
    throw new Error()
  }

  const result = await oauth.processUserInfoResponse(as, client, claims.sub, userInfoResponse)
  return session_callback(result)
}
