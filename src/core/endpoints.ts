import type { PayloadRequest } from 'payload/types'
import type { Endpoint } from 'payload/config'
import type { PluginOptions } from '../types'
import { handleAuthorization, handleCallback } from './handlers'

export const AUTHORIZATION_PATH = '/oauth2/authorization/'
export const CALLBACK_PATH = '/oauth2/callback/'

export function generateEndpoints(pluginOptions: PluginOptions): Endpoint[] {
  return Object.keys(pluginOptions.providers).reduce(
    (customEndpoints: Endpoint[], providerId: string) => {
      customEndpoints.push({
        path: `${AUTHORIZATION_PATH}${providerId}`,
        method: 'get',
        handler: (req: PayloadRequest) =>
          handleAuthorization(req, pluginOptions.providers[providerId]),
      })
      customEndpoints.push({
        path: `${CALLBACK_PATH}${providerId}`,
        method: 'get',
        handler: (req: PayloadRequest) => handleCallback(req, pluginOptions.providers[providerId]),
      })
      return customEndpoints
    },
    [],
  )
}
