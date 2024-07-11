import type { Config, Plugin } from 'payload/config'

import { onInitExtension } from './onInitExtension'
import type { PluginTypes } from './types'
import AfterDashboard from './components/AfterDashboard'
import newCollection from './newCollection'

type PluginType = (pluginOptions: PluginTypes) => Plugin

export const samplePlugin =
  (pluginOptions: PluginTypes): Plugin =>
  incomingConfig => {
    let config = { ...incomingConfig }

    config.admin = {
      ...(config.admin || {}),

      // Add additional admin config here

      components: {
        ...(config.admin?.components || {}),
        // Add additional admin components here
        afterDashboard: [...(config.admin?.components?.afterDashboard || []), AfterDashboard],
      },
    }

    // If the plugin is disabled, return the config without modifying it
    // The order of this check is important, we still want any webpack extensions to be applied even if the plugin is disabled
    if (pluginOptions.enabled === false) {
      return config
    }

    config.collections = [
      ...(config.collections || []),
      // Add additional collections here
      newCollection, // delete this line to remove the example collection
    ]

    config.endpoints = [
      ...(config.endpoints || []),
      {
        path: '/custom-endpoint',
        method: 'get',
        handler: async req => {
          return new Response(JSON.stringify({ message: 'Here is a custom endpoint' }), {
            status: 200,
          })
        },
      },
      // Add additional endpoints here
    ]

    config.globals = [
      ...(config.globals || []),
      // Add additional globals here
    ]

    config.hooks = {
      ...(config.hooks || {}),
      // Add additional hooks here
    }

    config.onInit = async payload => {
      if (incomingConfig.onInit) await incomingConfig.onInit(payload)
      // Add additional onInit code by using the onInitExtension function
      onInitExtension(pluginOptions, payload)
    }

    return config
  }
