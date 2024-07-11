import type { PayloadRequest } from 'payload/types'
import type { Endpoint } from 'payload/config'
import { generators } from 'openid-client'
import type { OauthPluginOptions, ProviderClientConfig } from '../types'
import { setCookies } from './cookies'
import { getClient } from './client'

export const AUTHORIZATION_PATH = '/oauth2/authorization/'
export const CALLBACK_PATH = '/oauth2/callback/'

async function handleAuthorization(
  request: PayloadRequest,
  provider: ProviderClientConfig,
): Promise<Response> {
  const { client } = getClient(request, provider)
  const code_verifier = generators.codeVerifier()
  const state = generators.state()

  const code_challenge = generators.codeChallenge(code_verifier)
  const url = client.authorizationUrl({
    scope: provider.scope,
    code_challenge,
    code_challenge_method: 'S256',
    state,
    prompt: provider.prompt,
    ...provider.params,
  })

  const cookieMaxage = new Date(Date.now() + 300 * 1000)

  setCookies({
    name: 'payload_oauth_code_verfier',
    value: code_verifier,
    maxAge: cookieMaxage,
    path: '/',
    httpOnly: true,
  })
  setCookies({
    name: 'payload_oauth_state',
    value: state,
    maxAge: cookieMaxage,
    path: '/',
    httpOnly: true,
  })
  return Response.redirect(url)
}

export function generateOauthEndpoints(pluginOptions: OauthPluginOptions): Endpoint[] {
  return pluginOptions.providers.map(provider => ({
    path: `${AUTHORIZATION_PATH}${provider.id}`,
    method: 'get',
    handler: (req: PayloadRequest) => handleAuthorization(req, provider),
  }))
}
