import type { Plugin } from 'payload/config'
import { createElement } from 'react'
import type { PluginOptions } from './types'
import { generateEndpoints } from './core'
import { generateAccountsCollection } from './core/collections'
import { AuthComponent } from './core/ui'

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
    const authComponentPos = pluginOptions.placeAuthComponent ?? 'afterLogin'

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

    // Add auth component to login page
    config.admin.components = {
      ...(config.admin.components ?? {}),
      [authComponentPos]: (
        (config.admin.components && config.admin.components[authComponentPos]) ??
        []
      ).concat(() =>
        createElement(AuthComponent, {
          providers: pluginOptions.providers,
          placeContent: authComponentPos,
        }),
      ),
    }
    return config
  }
