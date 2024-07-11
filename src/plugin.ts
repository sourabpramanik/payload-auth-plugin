import type { Plugin } from 'payload/config'
import type { OauthConfig } from './types'

export const samplePlugin =
  (pluginOptions: OauthConfig): Plugin =>
  incomingConfig => {
    const config = { ...incomingConfig }

    config.admin = {
      ...(config.admin || {}),
    }

    if (pluginOptions.enabled === false) {
      return config
    }

    return config
  }
