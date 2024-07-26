import type { PayloadRequest } from 'payload'
import { cookies } from 'next/headers'
import * as oauth from 'oauth4webapi'
import type { AccountInfo, OAuth2ProviderConfig } from '../../types'
import { getCallbackURL } from '../utils/cb'
import { AuthError } from '../error'

export async function OAuth2Callback(
  request: PayloadRequest,
  provider: OAuth2ProviderConfig,
  errorRedirectPath: string,
  session_callback: (accountInfo: AccountInfo) => Promise<Response>,
): Promise<Response> {
  const state = cookies().get('payload_auth_state')
  const code_verifier = cookies().get('payload_auth_code_verifier')

  if (!code_verifier) {
    throw Error('Invalid session')
  }
  cookies().delete('payload_auth_code_verifier')
  cookies().delete('payload_auth_state')

  const client: oauth.Client = {
    client_id: provider.client_id,
    client_secret: provider.client_secret,
    token_endpoint_auth_method: 'client_secret_basic',
  }

  const current_url = new URL(request.url as string)
  const callback_url = getCallbackURL(request)
  const as = provider.authorization_server

  const params = oauth.validateAuthResponse(as, client, current_url, state?.value as string)

  if (oauth.isOAuth2Error(params)) {
    return AuthError(request, errorRedirectPath, 'Invalid params')
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
    return AuthError(request, errorRedirectPath, 'Failed to authenticate')
  }

  const token_result = await oauth.processAuthorizationCodeOAuth2Response(as, client, response)
  if (oauth.isOAuth2Error(token_result)) {
    return AuthError(request, errorRedirectPath, 'Failed to authenticate')
  }

  const userInfoResponse = await oauth.userInfoRequest(as, client, token_result.access_token)
  const userInfo = await userInfoResponse.json()
  return session_callback(provider.profile(userInfo))
}
