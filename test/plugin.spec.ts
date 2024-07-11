import type { Server } from 'http'
import mongoose from 'mongoose'
import payload from 'payload'
//import { start } from './src/server'
import { nextDev } from 'next/dist/cli/next-dev.js'

describe('Plugin tests', () => {
  let server: Server

  console.log('run start')

  beforeAll(async () => {
    console.log('run start')
    //await start({ local: true })
    nextDev({ port: 3000 }, 'default', '../dev')
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
  })

  // Add tests to ensure that the plugin works as expected

  // Example test to check for seeded data
  it('seeds data accordingly', async () => {
    const newCollectionQuery = await payload.find({
      collection: 'new-collection',
      sort: 'createdAt',
    })

    expect(newCollectionQuery.totalDocs).toEqual(1)
  })
})
