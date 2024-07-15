import * as oauth from 'oauth4webapi'
import type { ProviderClientConfig, ProviderConfig } from '../types'

const issuer = new URL('https://accounts.google.com')
const algorithm = 'oidc'

const authorization_server = await oauth
  .discoveryRequest(issuer, {
    algorithm,
  })
  .then(response => oauth.processDiscoveryResponse(issuer, response))

type GoogleAuthConfig = ProviderConfig

function GoogleAuthProvider(config: GoogleAuthConfig): ProviderClientConfig {
  return {
    scope: 'openid email profile',
    ...config,
    authorization_server,
    displayName: 'Google',
    algorithm,
  }
}

export default GoogleAuthProvider
