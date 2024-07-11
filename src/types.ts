import type { ButtonHTMLAttributes } from 'react'
import { type Issuer } from 'openid-client'

export interface OauthBaseConfig {
  /*
   * Oauth provider Client ID
   */
  client_id: string
  /*
   * Oauth provider Client Secret
   */
  client_secret: string
  /*
   * Optional scope of user information
   */
  scope: string
  prompt?: string
  /*
   * Additional parameters you would like to add to query for the provider
   */
  params?: Record<string, string>
  /*
   * Payload users collection
   */
  userCollection?: {
    /*
     * @default "users"
     */
    slug?: string
  }
  /*
   * Sub field will be created if it doesn't exists already.
   */
  sub?: {
    /*
     * @default "sub"
     */
    name?: string
  }
  /*
   * Signin button position.
   * @default 'afterLogin'
   */
  buttonComponent?: 'beforeLogin' | 'afterLogin'
  /*
   * Optional signing button props.
   */
  buttonProps?: SigninButtonProps
  /*
   * @default '/admin'
   */
  successRedirect?: string
  /*
   * @default '/login'
   */
  failureRedirect?: string
}

export interface OauthConfig extends OauthBaseConfig {
  issuer: Issuer
  displayName: string
}

export interface SigninButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /*
   * @default "Signin with {provider}"
   */
  label?: string
}
