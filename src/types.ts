import type { AuthorizationServer } from 'oauth4webapi'

export interface AccountInfo {
  sub: string
  name: string
  picture: string
  email: string
}

interface BaseConfig {
  id: string
  name: string
  scope: string
  profile: (profile: Record<string, string | number | boolean | object>) => AccountInfo
}

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

export interface OIDCProviderConfig extends BaseConfig, ProviderConfig {
  issuer: string
  algorithm: 'oidc'
}

export interface OAuth2ProviderConfig extends BaseConfig, ProviderConfig {
  authorization_server: AuthorizationServer
  algorithm: 'oauth2'
}

export type OAuthProviderConfig = OIDCProviderConfig | OAuth2ProviderConfig

export interface PluginOptions {
  /* Enable or disable plugin
   * @default true
   */
  enabled?: boolean
  /*
   * OAuth Providers
   */
  providers: OAuthProviderConfig[]
  /*
   * Accounts collections slug
   * @default {slug: "accounts"}
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
   * @default '/admin'
   */
  successRedirect?: string
  /*
   * Any path in your application where the users can be redirected in case of errors
   * @default '/login'
   */
  errorRedirect?: string
}

export type EndpointOptions = Omit<
  PluginOptions,
  'providers' | 'buttonProps' | 'placeAuthComponent' | 'enabled'
> & {
  providers: Record<string, OAuthProviderConfig>
}

export type SessionOptions = Omit<
  PluginOptions,
  'providers' | 'buttonProps' | 'buttonComponent' | 'enabled'
>
