import type * as oauth from 'oauth4webapi'
import type { OAuth2ProviderConfig, ProviderConfig } from '../types'

const authorization_server: oauth.AuthorizationServer = {
  issuer: 'https://github.com',
  authorization_endpoint: 'https://github.com/login/oauth/authorize',
  token_endpoint: 'https://github.com/login/oauth/access_token',
  userinfo_endpoint: 'https://api.github.com/user',
}

type GitHubAuthConfig = ProviderConfig

function GitHubAuthProvider(config: GitHubAuthConfig): OAuth2ProviderConfig {
  return {
    ...config,
    scope: 'openid email profile',
    authorization_server,
    name: 'GitHub',
    algorithm: 'oauth2',
    uidField: 'id',
    nameField: 'name',
    pictureField: 'picture',
    emailField: 'email',
  }
}

export default GitHubAuthProvider
