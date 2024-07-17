import type { PayloadRequest } from 'payload/types'
import type { ProviderClientConfig } from '../../types'
import { OIDCAuthorization } from '../resources/oidc_authorization'
import { OIDCCallback } from '../resources/oidc_callback'

export function GET(
  request: PayloadRequest,
  resource: string,
  provider: ProviderClientConfig,
): Promise<Response> {
  switch (resource) {
    case 'authorization':
      switch (provider.algorithm) {
        case 'oidc':
          return OIDCAuthorization(request, provider)
        default:
          throw Error(`Invalid provider request`)
      }
    case 'callback':
      switch (provider.algorithm) {
        case 'oidc':
          return OIDCCallback(request, provider)
        default:
          throw Error(`Invalid provider request`)
      }
    default:
      throw Error('Invalid resource request')
  }
}
