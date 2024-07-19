import type { Plugin } from 'payload/config'
import { createElement } from 'react'
import type {
  EndpointOptions,
  OAuth2ProviderConfig,
  OIDCProviderConfig,
  PluginOptions,
} from './types'
import { generateEndpoints } from './core'
import { generateAccountsCollection } from './core/collections'
import { AuthComponent } from './core/ui'

export const AuthPlugin =
  (pluginOptions: PluginOptions<OIDCProviderConfig | OAuth2ProviderConfig>): Plugin =>
  incomingConfig => {
    const config = { ...incomingConfig }

    // Default is true
    if (pluginOptions.enabled === false) {
      return config
    }

    const {
      accountsCollection,
      usersCollectionSlug,
      providers,
      placeAuthComponent,
      successRedirect,
      errorRedirect,
    } = pluginOptions

    const providersRecord = providers.reduce(
      (
        record: Record<string, OAuth2ProviderConfig | OIDCProviderConfig>,
        provider: OAuth2ProviderConfig | OIDCProviderConfig,
      ) => {
        const newRecord = {
          ...record,
          [provider.id]: provider,
        }
        return newRecord
      },
      {},
    )
    const accountsSlug = accountsCollection?.slug ?? 'accounts'
    const usersSlug = usersCollectionSlug ?? 'users'
    const authComponentPos = placeAuthComponent ?? 'afterLogin'

    config.admin = {
      ...(config.admin ?? {}),
    }

    // Create accounts collection if doesn't exists
    config.collections = [
      generateAccountsCollection(accountsSlug, usersSlug),
      ...(config.collections ?? []),
    ]

    // Add custom endpoints
    const endpointOptions: EndpointOptions<OAuth2ProviderConfig | OIDCProviderConfig> = {
      providers: providersRecord,
      accountsCollection,
      usersCollectionSlug,
      successRedirect,
      errorRedirect,
    }
    config.endpoints = [...(config.endpoints ?? []), ...generateEndpoints(endpointOptions)]

    // Add auth component to login page
    config.admin.components = {
      ...(config.admin.components ?? {}),
      [authComponentPos]: (
        (config.admin.components && config.admin.components[authComponentPos]) ??
        []
      ).concat(() =>
        createElement(AuthComponent, {
          providers: providersRecord,
          placeContent: authComponentPos,
        }),
      ),
    }
    return config
  }
