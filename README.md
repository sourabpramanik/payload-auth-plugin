
![cover image](https://github.com/user-attachments/assets/ae16c040-1b16-4b93-8cbe-8337ebb0759c)

> **Note: This plugin supports all versions of Payload CMS starting from version 3.0 and above.**

# Authentication plugin for PayloadCMS
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

### Signin UI component
The auth signin component is added to the signin page when you integrate the plugin. It can be customized by passing the relevant configuration options.

## Usage

### Install the plugin
```bash
npm install payload-auth-plugin
```
Or
```bash
yarn add payload-auth-plugin
```
Or
```bash
pnpm add payload-auth-plugin
```
### Create an OAuth app
In your desired provider, create an OAuth application. Depending on your provider, you will need to obtain the Client ID and Client Secret from the provider's console or dashboard. Please refer to the [providers list](https://github.com/sourabpramanik/plugin-payload-oauth?tab=readme-ov-file#list-of-active-and-upcoming-providers) for detailed instructions on configuring a specific provider.

For example:
To configure Google OAuth

1. Add the callback/redirect URL:
```bash
`https://acme.com/api/oauth/callback/google`
```
2. Get the Client ID and Client Secret and set the `.env` variables in your Payload CMS application:
```text
GOOGLE_CLIENT_ID=****************************
GOOGLE_CLIENT_SECRET=****************************
```

### Configure the plugin
Import the plugin in `src/payload.config.ts` and set up a provider:
```typescript

import { buildConfig } from 'payload/config'

// --- rest of the imports

import AuthPlugin from 'payload-auth-plugin'
import 'payload-auth-plugin/styles'
import { GoogleAuthProvider } from 'payload-auth-plugin/providers'

export default buildConfig({
  // --- rest of the config

  plugins: [
  // --- rest of the plugins

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
And that's it, now you can run the dev server, and you can now sign in in with Google.

## Configuration options
Configuration options allow you to extend the plugin to customize the flow and UI based on your requirements. You can explore the available options to understand their purposes and how to use them.

| Options | Description | Default |
| --- | --- | :--: |
| `enabled`: ***boolean*** | Disable or enable plugin | true |
| `accountsCollection`: ***object*** | Accounts collection configuration parameters | {slug: accounts} |
| `usersCollectionSlug`: ***string*** | Payload users collection slug | user |
| `placeAuthComponent`: ***afterLogin or beforeLogin*** | Place the Oauth signin component before or after the Payload's default signin form | afterLogin |
| `buttonProps`: ***ButtonProps*** | Takes the default props defined by the Payload UI button element | null |
| `successRedirect`: ***string*** | Specify the path to redirect users on successful signin attempt | `/admin` |
| `errorRedirect`: ***string*** | Specify the path to redirect users on failed signin attempt | `/admin/login` |


## Open Authorization/OpenID Connect Protocol Based Providers
This plugin includes multiple pre-configured Open Authorization (OAuth) and OpenID Connect protocol-based providers. These configurations streamline the developer experience and integrations, ensuring the authentication process is seamless and uniform across different providers.

To get started, you'll need the Client ID and Client Secret tokens, which can be found in the provider's console/dashboard. Provide these tokens to the plugin's provider settings.

Some providers may require additional domain-specific metadata that cannot be generalized. In such cases, you'll need to provide these specific details as well.

### List of active and upcoming providers:

- [X] Google [Doc](https://developers.google.com/identity/protocols/oauth2)
- [X] GitHub [Doc](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps)
- [ ] Auth0
- [X] Atlassian [Doc](https://developer.atlassian.com/cloud/confluence/oauth-2-3lo-apps/)
- [ ] Azure Active Directory
- [X] Discord [Doc](https://discord.com/developers/docs/topics/oauth2)
- [ ] Dropbox
- [ ] Facebook
- [ ] Instagram
- [X] GitLab [Doc](https://docs.gitlab.com/ee/api/oauth2.html)
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
