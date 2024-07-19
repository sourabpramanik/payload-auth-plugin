import type * as oauth from 'oauth4webapi'
import type { OAuth2ProviderConfig, ProviderConfig } from '../types'

const algorithm = 'oauth2'

const authorization_server: oauth.AuthorizationServer = {
  issuer: 'https://auth.atlassian.com',
  authorization_endpoint: 'https://auth.atlassian.com/authorize',
  token_endpoint: 'https://auth.atlassian.com/oauth/token',
  userinfo_endpoint: 'https://api.atlassian.com/me',
}

type AtlassianAuthConfig = ProviderConfig

function AtlassianAuthProvider(config: AtlassianAuthConfig): OAuth2ProviderConfig {
  return {
    ...config,
    id: 'atlassian',
    authorization_server,
    name: 'Atlassian',
    algorithm,
    uidField: 'account_id',
    emailField: 'email',
    nameField: 'name',
    pictureField: 'picture',
    scope: 'read:me read:account',
  }
}

export default AtlassianAuthProvider
