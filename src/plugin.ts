import type { Plugin } from 'payload/config'
import type { PluginOptions } from './types'
import { generateEndpoints } from './core'
import { generateAccountsCollection } from './core/collections'

export const AuthPlugin =
  (pluginOptions: PluginOptions): Plugin =>
  incomingConfig => {
    const config = { ...incomingConfig }

    // Default is true
    if (pluginOptions.enabled === false) {
      return config
    }

    const accountsCollectionSlug = pluginOptions.accountsCollection?.slug ?? 'accounts'
    const usersCollectionSlug = pluginOptions.usersCollectionSlug ?? 'users'

    config.admin = {
      ...(config.admin ?? {}),
    }

    // Create accounts collection if doesn't exists
    config.collections = [
      generateAccountsCollection(accountsCollectionSlug, usersCollectionSlug),
      ...(config.collections ?? []),
    ]

    // Add custom endpoints
    config.endpoints = [...(config.endpoints ?? []), ...generateEndpoints(pluginOptions)]

    return config
  }
