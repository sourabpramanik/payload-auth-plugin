import type { AuthorizationServer } from 'oauth4webapi'
import type { ButtonHTMLAttributes } from 'react'

export interface ProviderConfig {
  /*
   * Oauth provider Client ID
   */
  client_id: string
  /*
   * Oauth provider Client Secret
   */
  client_secret: string
  /*
   * (Optional) Request user information resources
   */
  scope?: string
  /*
   * Provider prompt screen config
   */
  prompt?: string
  /*
   * Additional parameters you would like to add to query for the provider
   */
  params?: Record<string, string>
}

export interface ProviderClientConfig extends ProviderConfig {
  authorization_server: AuthorizationServer
  algorithm: 'oidc' | 'oauth2'
  displayName: string
}

export interface PluginOptions {
  /* Enable or disable plugin
   * @default true
   */
  enabled?: boolean
  /*
   * OAuth Provider
   */
  providers: Record<string, ProviderClientConfig>
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
   * Sub field will be created if it doesn't exists already. Or provide a field name.
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

export interface SigninButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /*
   * @default "Signin with {provider}"
   */
  label?: string
}
