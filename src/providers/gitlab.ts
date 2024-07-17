import * as oauth from 'oauth4webapi'
import type { ProviderClientConfig, ProviderConfig } from '../types'

const issuer = new URL('https://gitlab.com')
const algorithm = 'oidc'

const authorization_server = await oauth
  .discoveryRequest(issuer, {
    algorithm,
  })
  .then(response => oauth.processDiscoveryResponse(issuer, response))

type GitLabAuthConfig = ProviderConfig

function GitLabAuthProvider(config: GitLabAuthConfig): ProviderClientConfig {
  return {
    scope: 'openid email profile',
    ...config,
    authorization_server,
    displayName: 'GitHub',
    algorithm,
  }
}

export default GitLabAuthProvider
