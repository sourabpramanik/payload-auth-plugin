import type { PayloadRequest } from 'payload/types'

export async function AuthError(
  req: PayloadRequest,
  path: string,
  message: string,
): Promise<Response> {
  const url = new URL(req.url as string)
  url.pathname = path
  url.search = encodeURIComponent(message)

  return Response.redirect(url.toString())
}
