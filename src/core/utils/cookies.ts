export function parseCookies(cookieString: string): Record<string, string> {
  const cookies: Record<string, string> = {}

  if (!cookieString) {
    return cookies
  }

  cookieString.split(';').forEach(cookie => {
    const parts = cookie.split('=')
    const name = parts[0].trim()
    const value = parts[1] ? parts[1].trim() : ''
    if (name) {
      cookies[name] = decodeURIComponent(value)
    }
  })

  return cookies
}
