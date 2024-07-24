import type { PayloadRequest } from 'payload'

export async function AuthError(
  req: PayloadRequest,
  path: string,
  message: string,
): Promise<Response> {
  const url = new URL(req.url as string)
  url.pathname = path
  url.search = ''
  url.searchParams.set('error', encodeURIComponent(message))

  return Response.redirect(url.toString())
}
