import type { PayloadRequest } from 'payload'

export function getCallbackURL(request: PayloadRequest): URL {
  const callback_url = new URL(request.url as string)
  callback_url.pathname = callback_url.pathname.replace(/\/authorization\//, '/callback/')

  callback_url.host = request.headers.get('x-forwarded-host') || callback_url.host
  callback_url.search = ''

  return callback_url
}
