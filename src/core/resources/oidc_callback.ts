import type { PayloadRequest } from 'payload/types'
import { cookies } from 'next/headers'
import * as oauth from 'oauth4webapi'
import type { ProviderClientConfig } from '../../types'
import { getCallbackURL } from '../utils/cb'

export async function OIDCCallback(
  request: PayloadRequest,
  provider: ProviderClientConfig,
): Promise<Response> {
  const nonce = cookies().get('payload_auth_nonce')
  const code_verifier = cookies().get('payload_auth_code_verifier')

  if (!code_verifier) {
    throw Error('Invalid session')
  }

  const client: oauth.Client = {
    client_id: provider.client_id,
    client_secret: provider.client_secret,
    token_endpoint_auth_method: 'client_secret_basic',
  }

  const current_url = new URL(request.url as string)
  const callback_url = getCallbackURL(request)
  const as = provider.authorization_server

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

  // const session_url = new URL(request.url as string)
  // session_url.pathname = session_url.pathname.replace(/\/callback\//, '/session/')
  // session_url.host = request.headers.get('x-forwarded-host') || callback_url.host
  // session_url.search = ''

  // cookies().set('session-token', token_result.access_token as string, {
  //   expires: new Date(Date.now() + 100 * 1000),
  //   path: '/',
  //   httpOnly: true,
  // })

  return Response.json('Session time')
}
