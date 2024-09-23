import { redirect } from 'next/navigation'

export function signin(provider: string) {
  redirect('/api/oauth/authorization/' + provider)
}
