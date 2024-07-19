import type { PayloadRequest } from 'payload/types'
import type { UserInfoResponse } from 'oauth4webapi'
import type {
  EndpointOptions,
  Oauth2AccountInfo,
  OAuth2ProviderConfig,
  OIDCProviderConfig,
  SessionOptions,
} from '../../types'
import { OAuth2Authorization, OIDCCallback, OIDCAuthorization, OAuth2Callback } from '../resources'
import { oauth2Session, oidcSession } from '../session'

export function GET(
  request: PayloadRequest,
  resource: string,
  providerId: string,
  pluginOptions: EndpointOptions<OAuth2ProviderConfig | OIDCProviderConfig>,
): Promise<Response> {
  const provider = pluginOptions.providers[providerId]
  if (!provider) {
    throw Error('Invalid provider request')
  }

  const { providers, ...rest } = pluginOptions
  const sessionOptions: SessionOptions<OAuth2ProviderConfig | OIDCProviderConfig> = rest

  switch (resource) {
    case 'authorization':
      switch (provider.algorithm) {
        case 'oidc':
          return OIDCAuthorization(request, provider)
        case 'oauth2':
          return OAuth2Authorization(request, provider)
        default:
          throw Error(`Invalid provider request`)
      }
    case 'callback':
      switch (provider.algorithm) {
        case 'oidc':
          return OIDCCallback(request, provider, (accountInfo: UserInfoResponse) =>
            oidcSession(request, provider, sessionOptions, accountInfo),
          )
        case 'oauth2':
          return OAuth2Callback(request, provider, (accountInfo: Oauth2AccountInfo) =>
            oauth2Session(request, provider, sessionOptions, accountInfo),
          )
        default:
          throw Error(`Invalid provider request`)
      }
    default:
      throw Error('Invalid resource request')
  }
}
