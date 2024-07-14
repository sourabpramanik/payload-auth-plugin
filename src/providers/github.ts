import type * as oauth from 'oauth4webapi'
import type { ProviderClientConfig, ProviderConfig } from '../types'

const algorithm = 'oauth2'

const authorization_server: oauth.AuthorizationServer = {
  issuer: 'https://github.com',
  authorization_endpoint: 'https://github.com/login/oauth/authorize',
  token_endpoint: 'https://github.com/login/oauth/access_token',
  userinfo_endpoint: 'https://api.github.com/user',
}

type GitHubAuthConfig = ProviderConfig

function GitHubAuthProvider(config: GitHubAuthConfig): ProviderClientConfig {
  return {
    ...config,
    authorization_server,
    displayName: 'GitHub',
    algorithm,
    scope: config.scope ?? 'openid email profile',
    provider_sub: 'id',
  }
}

export default GitHubAuthProvider
