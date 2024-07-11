import type { Payload } from 'payload'

import type { PluginTypes } from './types'

export const onInitExtension = (pluginOptions: PluginTypes, payload: Payload): void => {
  try {
    // You can use the existing express app here to add middleware, routes, etc.
    // app.use(...)
  } catch (err: unknown) {
    payload.logger.error({ msg: 'Error in onInitExtension', err })
  }
}
