> **Note: This plugin supports all versions of Payload CMS starting from version 3.0 and above.**

# PayloadCMS OAuth Plugin
This plugin is designed to simplify the integration of multiple Open Authorization (OAuth) and OpenID Connect providers with Payload CMS. Developers can quickly and effortlessly set up authentication mechanisms by leveraging pre-configured providers.

## How it works?
The initial goal in developing this plugin was to abstract its configurations and the resources it utilizes, minimizing the setup required by developers. This way, integrating any supported provider with Payload CMS involves minimal effort.

> There is a scope for future improvements to make every implementation more and more flexible and straightforward

### Collections
This plugin creates an Accounts collection with the slug `accounts`, which includes all necessary fields. This collection establishes a one-to-one relationship with the Users collection, allowing existing users to sign in with multiple providers. The Accounts collection stores information such as the provider's name and issuer, and it links the account to the user upon first sign-in.

A single user can have multiple accounts, but each account can be associated with only one user.

If you already have a collection with the slug `accounts`, it can cause a conflict and prevent the plugin from integrating successfully. To avoid this issue, make sure to change the slug before integrating this plugin.

### Endpoints
For every provider with different protocols, the endpoints are already configured in the plugin. So any request that comes to the `/api/oauth/**/*` route will be handled by the plugin. 

### Login UI
Currently, the OAuth login component is added to the login page when you integrate the plugin. It can be customized by passing the relevant configuration options.

## Usage

### Install the plugin
```bash
npm install plugin-payload-oauth
```
```bash
yarn add plugin-payload-oauth
```
```bash
pnpm install plugin-payload-oauth
```
### Create an OAuth app
In your desired provider, create an OAuth application. Depending on your provider, you will need to obtain the Client ID and Client Secret from the provider's console or dashboard. For detailed instructions on configuring a specific provider, please refer to the documentation.

For example: 
To configure Google OAuth

1. Add the callback/redirect URL:
```bash
[your_domain]/api/oauth/callback/google
```
2. Get the Client ID and Client Secret and set the `.env` variables in your Payload CMS application:
```text
GOOGLE_CLIENT_ID=****************************
GOOGLE_CLIENT_SECRET=****************************
```

### Configure the plugin
Import the plugin in `src/payload.config.ts` and set up the provider:
```typescript
// --- rest of the imports
import { buildConfig } from 'payload/config'
import AuthPlugin from 'plugin-payload-oauth'
import { GoogleAuthProvider } from 'plugin-payload-oauth/providers'

export default buildConfig({
// --- rest of the config
  plugins: [
  // --- rest of plugins
  AuthPlugin({
      providers: [
        GoogleAuthProvider({
          client_id: process.env.GOOGLE_CLIENT_ID as string,
          client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
      ],
    }),
  ]
})
```

And that's it, run the dev server and you can now login with Google.

## Options
Options allow you to extend the plugin to customize the flow and UI based on your requirements. Explore the available options to understand their purposes and how to use them.
Coming soon.....

## Open Authorization/OpenID Connect Protocol Based Providers
This plugin includes multiple pre-configured Open Authorization (OAuth) and OpenID Connect protocol-based providers. These configurations streamline the developer experience and integrations, ensuring the authentication process is seamless and uniform across different providers.

To get started, you'll need the Client ID and Client Secret tokens, which can be found in the provider's console/dashboard. Provide these tokens to the plugin's provider settings.

Some providers may require additional domain-specific metadata that cannot be generalized. In such cases, you'll need to provide these specific details as well.

### List of active and upcoming providers:

- [X] Google
- [X] GitHub
- [ ] Auth0
- [X] Atlassian
- [ ] Azure Active Directory
- [ ] Discord
- [ ] Dropbox
- [ ] Facebook
- [ ] Instagram
- [X] GitLab
- [ ] Okta
- [ ] Slack
- [ ] Reddit
- [ ] X(Twitter)
- [ ] Netlify
- [ ] Salesforce
- [ ] LinkedIn

## Roadmap
Ordered according to the priority

- Support multiple providers [Feat] ✅
- Add options to customize the sign-in button [Feat] ✅
- Handle errors gracefully [Fix] ✅
- Support SAML/SSO sign-in [Feat] ⚙
- Support magic link [Feat] ⚙
- Support Passkey sign-in [Feat]❓
- Support front-end authentication [Feat]❓
