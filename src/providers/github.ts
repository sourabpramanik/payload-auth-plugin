import { Issuer } from 'openid-client'
import type { ProviderClientConfig, ProviderConfig } from '../types'

type GitHubPrompt = 'select_account'
type GitHubAccessType = 'offline' | 'online'

const issuer = new Issuer({
  issuer: 'https://github.com',
  authorization_endpoint: 'https://github.com/login/oauth/authorize',
  token_endpoint: 'https://github.com/login/oauth/access_token',
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
    id: 'github',
    params: {
      ...(config.access_type && { access_type: config.access_type }),
      ...config.params,
      allow_signup: 'true',
      state: 'somethingverysecret',
    },
  }
}

export default GitHubAuthProvider
