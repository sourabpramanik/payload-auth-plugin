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
  provider_sub?: string
  displayName: string
}

export interface PluginOptions {
  /* Enable or disable plugin
   * @default true
   */
  enabled?: boolean
  /*
   * Providers
   */
  providers: Record<string, ProviderClientConfig>
  /*
   * Accounts are associated with user. A user can have multiple accounts but each account can belong to only one user.
   * By default the accounts collection created by this plugin will use "accounts" slug.
   * If there is already a collection with slug "accounts" then provide an alternate slug so that the plugin can generate a new collection using that slug.
   */
  accountsCollection?: {
    slug: string
  }
  /*
   * Users collection slug.
   * @default "users"
   */
  usersCollectionSlug?: string
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
