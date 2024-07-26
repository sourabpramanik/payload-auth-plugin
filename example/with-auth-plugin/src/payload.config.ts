// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

import AuthPlugin from '../../../dist/src'
import {
  GoogleAuthProvider,
  GitHubAuthProvider,
  GitLabAuthProvider,
  AtlassianAuthProvider,
  DiscordAuthProvider,
} from '../../../dist/src/providers'
import '../../../dist/src/index.css'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    AuthPlugin({
      providers: [
        GoogleAuthProvider({
          client_id: process.env.GOOGLE_CLIENT_ID as string,
          client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        GitHubAuthProvider({
          client_id: process.env.GITHUB_CLIENT_ID as string,
          client_secret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
        GitLabAuthProvider({
          client_id: process.env.GITLAB_CLIENT_ID as string,
          client_secret: process.env.GITLAB_CLIENT_SECRET as string,
        }),
        AtlassianAuthProvider({
          client_id: process.env.ATLASSIAN_CLIENT_ID as string,
          client_secret: process.env.ATLASSIAN_CLIENT_SECRET as string,
        }),
        DiscordAuthProvider({
          client_id: process.env.DISCORD_CLIENT_ID as string,
          client_secret: process.env.DISCORD_CLIENT_SECRET as string,
        }),
      ],
    }),
  ],
})
