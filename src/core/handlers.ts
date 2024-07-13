'use server'

import type { PayloadRequest } from 'payload/types'
import { cookies } from 'next/headers'
import { generators } from 'openid-client'
import type { ProviderClientConfig } from '../types'
import { getClient } from './client'

// class OauthError extends Error {}

export async function handleAuthorization(
  request: PayloadRequest,
  provider: ProviderClientConfig,
): Promise<Response> {
  const { client } = getClient(request, provider)

  const nonce = generators.nonce()
  const state = generators.state()

  const url = client.authorizationUrl({
    scope: provider.scope,
    response_mode: 'form_post',
    nonce,
    state,
    prompt: provider.prompt,
  })

  const cookieMaxage = new Date(Date.now() + 300 * 1000)

  cookies().set('payload_oid_state', state, {
    maxAge: cookieMaxage,
    path: '/',
    httpOnly: true,
    secure: true,
  })
  cookies().set('payload_oid_nonce', nonce, {
    maxAge: cookieMaxage,
    path: '/',
    httpOnly: true,
    secure: true,
  })
  return Response.redirect(url)
}

export async function handleOauthCallback(
  request: PayloadRequest,
  provider: ProviderClientConfig,
): Promise<Response> {
  const state = cookies().get('payload_oid_state')
  const nonce = cookies().get('payload_oid_nonce')
  console.log(state)

  const { callback_url, client } = getClient(request, provider)

  const formData = await request.formData()

  const tokenset = await client.callback(callback_url.toString(), Object.fromEntries(formData), {
    state: state?.value,
    nonce: nonce?.value,
  })

  if (!tokenset.access_token) {
    throw Error('Missing access token')
  }

  //  const userInfo = await client.userinfo(tokenset.access_token)
  //  if (!userInfo) {
  //    throw new OauthError('Failed to fetch user information')
  //  }

  return Response.json({
    message: 'yooo damn',
  })
}
