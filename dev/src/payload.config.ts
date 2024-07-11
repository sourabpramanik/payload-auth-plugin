import path from 'path'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import sharp from 'sharp'
import { buildConfig } from 'payload/config'
import Users from './collections/Users'
import Examples from './collections/Examples'
import { OauthPlugin } from '../../src/index'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Users.slug,
  },
  collections: [Examples, Users],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  plugins: [OauthPlugin({})],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
})
