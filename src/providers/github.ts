import { Issuer } from 'openid-client'
import type { ProviderClientConfig, ProviderConfig } from '../types'

type GitHubPrompt = 'select_account'
type GitHubAccessType = 'offline' | 'online'

const issuer = new Issuer({
  issuer: 'https://github.com',
  authorization_endpoint: 'https://github.com/login/oauth/authorize',
  token_endpoint: 'https://github.com/login/oauth/access_token',
  userinfo_endpoint: 'https://api.github.com/user',
})

type GitHubAuthConfig = ProviderConfig & {
  prompt?: GitHubPrompt
  access_type?: GitHubAccessType
}

function GitHubAuthProvider(config: GitHubAuthConfig): ProviderClientConfig {
  return {
    ...config,
    issuer,
    displayName: 'GitHub',
    scope: 'openid email profile',
  }
}

export default GitHubAuthProvider
