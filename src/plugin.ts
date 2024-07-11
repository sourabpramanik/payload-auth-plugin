import type { Plugin } from 'payload/config'
import type { TextField } from 'payload/types'
import type { OauthPluginOptions } from './types'
import { generateOauthEndpoints } from './core'

export const OauthPlugin =
  (pluginOptions: OauthPluginOptions): Plugin =>
  incomingConfig => {
    const config = { ...incomingConfig }

    // Default is true
    if (pluginOptions.enabled === false) {
      return config
    }

    const collectionSlug = pluginOptions.userCollection?.slug || 'users'
    const sub = pluginOptions.sub?.name || 'sub'

    config.admin = {
      ...(config.admin || {}),
    }

    // Configure collections
    // Update Users collection with sub field if it doesn't exists
    config.collections = (config.collections || []).map(collectionConfig => {
      if (
        collectionConfig.slug === collectionSlug &&
        !collectionConfig.fields.some(field => (field as TextField).name === sub)
      ) {
        collectionConfig.fields.push({
          name: sub,
          type: 'text',
          admin: { readOnly: true },
          access: { update: () => false },
        })
      }
      return collectionConfig
    })

    // Add custom endpoints
    config.endpoints = [...(config.endpoints || []), ...generateOauthEndpoints(pluginOptions)]

    return config
  }
