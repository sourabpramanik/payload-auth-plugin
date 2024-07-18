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
   * Additional parameters you would like to add to query for the provider
   */
  params?: Record<string, string>
}
export interface OIDCProviderConfig extends ProviderConfig {
  issuer: URL
  name: string
  algorithm: 'oidc'
  scope: string
}
export interface OAuth2ProviderConfig extends ProviderConfig {
  authorization_server: AuthorizationServer
  name: string
  algorithm: 'oauth2'
  scope: string
  nameField: string
  uidField: string
  emailField: string
  pictureField: string
}

export interface PluginOptions {
  /* Enable or disable plugin
   * @default true
   */
  enabled?: boolean
  /*
   * Providers
   */
  providers: Record<string, OAuth2ProviderConfig | OIDCProviderConfig>
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
export type SessionOptions = Omit<
  PluginOptions,
  'providers' | 'buttonProps' | 'buttonComponent' | 'enabled'
>

export interface Oauth2AccountInfo {
  sub: string
  name?: string
  email?: string
  picture?: string
}
export interface SigninButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /*
   * @default "Signin with {provider}"
   */
  label?: string
}
