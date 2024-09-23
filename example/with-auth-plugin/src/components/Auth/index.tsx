import { Button } from '@payloadcms/ui'
import { signin } from '../../../../../dist/client'

export const AuthComponent = () => {
  return (
    <form
      action={async () => {
        'use server'
        signin('google')
      }}
    >
      <Button type="submit">Sign in with Google</Button>
    </form>
  )
}
