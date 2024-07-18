import type { OIDCProviderConfig, ProviderConfig } from '../types'

type GoogleAuthConfig = ProviderConfig

function GoogleAuthProvider(config: GoogleAuthConfig): OIDCProviderConfig {
  return {
    ...config,
    scope: 'openid email profile',
    issuer: new URL('https://accounts.google.com'),
    name: 'Google',
    algorithm: 'oidc',
  }
}

export default GoogleAuthProvider
