import type { Client } from 'openid-client'
import type { PayloadRequest } from 'payload/types'
import type { ProviderClientConfig } from '../types'

export function getClient(
  request: PayloadRequest,
  clientConfig: ProviderClientConfig,
): {
  callback_url: string
  client: Client
} {
  const callback_url = new URL(request.url as string)
  callback_url.pathname = callback_url.pathname.replace(/authenticate.*$/, 'callback')
  callback_url.host = request.headers.get('x-forwarded-host') || callback_url.host
  callback_url.search = ''

  const client = new clientConfig.issuer.Client({
    client_id: clientConfig.client_id,
    client_secret: clientConfig.client_secret,
    redirect_uris: [callback_url.toString()],
    response_types: ['code'],
  })
  return {
    client,
    callback_url: callback_url.toString(),
  }
}
