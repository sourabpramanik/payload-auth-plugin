import type { Endpoint, PayloadRequest } from 'payload'
import type { EndpointOptions } from '../types'
import { GET } from './handlers/GET'

export function generateEndpoints(pluginOptions: EndpointOptions): Endpoint[] {
  return [
    {
      path: '/oauth/:resource/:provider',
      method: 'get',
      handler: (request: PayloadRequest) => {
        return GET(
          request,
          request.routeParams?.resource as string,
          request.routeParams?.provider as string,
          pluginOptions,
        )
      },
    },
  ]
}
