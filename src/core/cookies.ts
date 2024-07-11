'use server'

import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'

interface CookiesType {
  name: string
  value: string
  maxAge: Date
  httpOnly?: boolean
  path?: string
  sameSite?: 'lax' | 'none' | 'strict'
  domain?: string
  secure?: boolean
}

export async function setCookies({
  name,
  value,
  httpOnly,
  sameSite,
  path,
  maxAge,
  domain,
  secure,
}: CookiesType): Promise<void> {
  cookies().set(name, value, {
    path: path || '/',
    httpOnly: httpOnly || false,
    secure: secure || false,
    sameSite: sameSite || 'lax',
    maxAge,
    domain: domain || '',
  })
}

export async function getCookies(name: string): Promise<RequestCookie | undefined> {
  return cookies().get(name)
}
