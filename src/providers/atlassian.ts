import type * as oauth from 'oauth4webapi'
import type { ProviderClientConfig, ProviderConfig } from '../types'

const algorithm = 'oauth2'

const authorization_server: oauth.AuthorizationServer = {
  issuer: 'https://auth.atlassian.com',
  authorization_endpoint: 'https://auth.atlassian.com/authorize',
  token_endpoint: 'https://auth.atlassian.com/oauth/token',
  userinfo_endpoint: 'https://api.atlassian.com/me',
}

type AtlassianAuthConfig = ProviderConfig

function AtlassianAuthProvider(config: AtlassianAuthConfig): ProviderClientConfig {
  return {
    ...config,
    authorization_server,
    displayName: 'Atlassian',
    algorithm,
    provider_sub: 'account_id',
  }
}

export default AtlassianAuthProvider
