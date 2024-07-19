import type { PayloadRequest } from 'payload/types'
import type { Endpoint } from 'payload/config'
import type { EndpointOptions, OAuth2ProviderConfig, OIDCProviderConfig } from '../types'
import { GET } from './handlers/GET'

export function generateEndpoints(
  pluginOptions: EndpointOptions<OAuth2ProviderConfig | OIDCProviderConfig>,
): Endpoint[] {
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
