import type { AccountInfo, OIDCProviderConfig, ProviderConfig } from '../types'

type GitLabAuthConfig = ProviderConfig

function GitLabAuthProvider(config: GitLabAuthConfig): OIDCProviderConfig {
  const algorithm = 'oidc'
  return {
    ...config,
    id: 'gitlab',
    scope: 'openid email profile',
    issuer: 'https://gitlab.com',
    name: 'GitLab',
    algorithm,
    profile: (profile): AccountInfo => {
      return {
        sub: profile.sub as string,
        name: profile.name as string,
        email: profile.email as string,
        picture: profile.picture as string,
      }
    },
  }
}

export default GitLabAuthProvider
