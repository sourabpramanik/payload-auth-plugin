import React from 'react'
import { Button } from '@payloadcms/ui/elements/Button'
import { redirect } from 'next/navigation'
import { OAuth2ProviderConfig, OIDCProviderConfig } from '../../types'
import './styles.css'

interface Props {
  providers: Record<string, OAuth2ProviderConfig | OIDCProviderConfig>
  placeContent: 'afterLogin' | 'beforeLogin'
}

const AuthFormComponent: React.FC<{ providerId: string; providerName: string }> = ({
  providerId,
  providerName,
}) => {
  const authAction = async () => {
    'use server'

    redirect(`/api/oauth/authorization/${providerId}`)
  }
  return (
    <form key={providerId} action={authAction}>
      <Button type="submit" size="medium" className="__auth-btn">
        Sign in with {providerName}
      </Button>
    </form>
  )
}

const AuthGroup: React.FC<Omit<Props, 'placeContent'>> = ({ providers }) => {
  return (
    <div className="__auth-btn-group">
      {Object.keys(providers).map(providerId => (
        <AuthFormComponent providerId={providerId} providerName={providers[providerId].name} />
      ))}
    </div>
  )
}

export const AuthComponent: React.FC<Props> = ({ providers, placeContent }) => {
  return (
    <div className={`__auth-block ${placeContent}`}>
      {placeContent === 'afterLogin' && (
        <div className="__auth-separator">
          <p>Or</p>
        </div>
      )}
      <AuthGroup providers={providers} />
      {placeContent === 'beforeLogin' && (
        <div className="__auth-separator">
          <p>Or</p>
        </div>
      )}
    </div>
  )
}
