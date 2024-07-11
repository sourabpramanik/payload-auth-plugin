import { Issuer } from 'openid-client'
import type { ProviderClientConfig, ProviderConfig } from '../types'

type GooglePrompt = 'none' | 'consent' | 'select_account'
type GoogleAccessType = 'offline' | 'online'

const issuer = await Issuer.discover('https://accounts.google.com')

type GoogleAuthConfig = ProviderConfig & {
  prompt?: GooglePrompt
  access_type?: GoogleAccessType
}

function GoogleAuthProvider(config: GoogleAuthConfig): ProviderClientConfig {
  return {
    ...config,
    issuer,
    displayName: 'Google',
    id: 'google',
    params: {
      ...(config.access_type && { access_type: config.access_type }),
      ...config.params,
    },
  }
}

export default GoogleAuthProvider
