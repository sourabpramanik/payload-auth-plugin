import type { PayloadRequest } from 'payload'
import * as oauth from 'oauth4webapi'
import type { AccountInfo, OIDCProviderConfig } from '../../types'
import { getCallbackURL } from '../utils/cb'
import { AuthError } from '../error'
import { parseCookies } from '../utils/cookies'

export async function OIDCCallback(
  request: PayloadRequest,
  providerConfig: OIDCProviderConfig,
  errorRedirectPath: string,
  session_callback: (claims: AccountInfo) => Promise<Response>,
): Promise<Response> {
  const parsedCookies = parseCookies(request.headers.get('Cookie')!)

  const code_verifier = parsedCookies['__session-code-verifier']
  const nonce = parsedCookies['__session-oauth-nonce']

  if (!code_verifier) {
    throw Error('Invalid session')
  }

  const { client_id, client_secret, issuer, algorithm, profile } = providerConfig
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
    return AuthError(request, errorRedirectPath, 'Invalid params')
  }

  const response = await oauth.authorizationCodeGrantRequest(
    as,
    client,
    params,
    callback_url.toString(),
    code_verifier,
  )
  const challenges = oauth.parseWwwAuthenticateChallenges(response)

  if (challenges) {
    return AuthError(request, errorRedirectPath, 'Failed to authenticate')
  }

  const token_result = await oauth.processAuthorizationCodeOpenIDResponse(
    as,
    client,
    response,
    nonce!,
  )

  if (oauth.isOAuth2Error(token_result)) {
    return AuthError(request, errorRedirectPath, 'Failed to authenticate')
  }

  const claims = oauth.getValidatedIdTokenClaims(token_result)
  const userInfoResponse = await oauth.userInfoRequest(as, client, token_result.access_token)

  if (oauth.parseWwwAuthenticateChallenges(userInfoResponse)) {
    return AuthError(request, errorRedirectPath, 'Failed to authenticate')
  }

  const result = await oauth.processUserInfoResponse(as, client, claims.sub, userInfoResponse)
  return session_callback(
    profile({
      sub: result.sub,
      name: result.name as string,
      email: result.email as string,
      picture: result.picture as string,
    }),
  )
}
