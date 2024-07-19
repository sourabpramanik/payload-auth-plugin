import type { OIDCProviderConfig, ProviderConfig } from '../types'

type GitLabAuthConfig = ProviderConfig

function GitLabAuthProvider(config: GitLabAuthConfig): OIDCProviderConfig {
  const issuer = new URL('https://gitlab.com')
  const algorithm = 'oidc'
  return {
    ...config,
    scope: 'openid email profile',
    issuer,
    name: 'GitLab',
    algorithm,
  }
}

export default GitLabAuthProvider
