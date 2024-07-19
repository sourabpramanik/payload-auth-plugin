import path from 'path'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { buildConfig } from 'payload/config'
import Users from './collections/Users'
import Examples from './collections/Examples'
import {
  GitHubAuthProvider,
  GoogleAuthProvider,
  AuthPlugin,
  GitLabAuthProvider,
  AtlassianAuthProvider,
} from '../../src/index'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Users.slug,
  },
  editor: lexicalEditor({}),
  collections: [Examples, Users],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  plugins: [
    AuthPlugin({
      placeAuthComponent: 'beforeLogin',
      providers: {
        google: GoogleAuthProvider({
          client_id: process.env.GOOGLE_CLIENT_ID as string,
          client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        github: GitHubAuthProvider({
          client_id: process.env.GITHUB_CLIENT_ID as string,
          client_secret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
        gitlab: GitLabAuthProvider({
          client_id: process.env.GITLAB_CLIENT_ID as string,
          client_secret: process.env.GITLAB_CLIENT_SECRET as string,
        }),
        atlassian: AtlassianAuthProvider({
          client_id: process.env.ATLASSIAN_CLIENT_ID as string,
          client_secret: process.env.ATLASSIAN_CLIENT_SECRET as string,
        }),
      },
    }),
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
})
