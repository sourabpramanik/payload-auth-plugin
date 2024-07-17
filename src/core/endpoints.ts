import type { PayloadRequest } from 'payload/types'
import type { Endpoint } from 'payload/config'
import type { PluginOptions } from '../types'
import { GET } from './handlers/GET'

export function generateEndpoints(pluginOptions: PluginOptions): Endpoint[] {
  return [
    {
      path: '/oauth/:resource/:provider',
      method: 'get',
      handler: (request: PayloadRequest) => {
        return GET(
          request,
          request.routeParams?.resource as string,
          pluginOptions.providers[request.routeParams?.provider as string],
        )
      },
    },
  ]
}
