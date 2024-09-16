import React from 'react'
import { OAuthProviderConfig } from '../../types'

interface Props {
  providers: Record<string, OAuthProviderConfig>
  placeContent: 'afterLogin' | 'beforeLogin'
}

const AuthFormComponent: React.FC<{ providerId: string; providerName: string }> = ({
  providerId,
  providerName,
}) => {
  return (
    <form key={providerId} action={`/api/oauth/authorization/${providerId}`} method="GET">
      <button type="submit" className="w-full !my-0">
        Sign in with {providerName}
      </button>
    </form>
  )
}

const AuthGroup: React.FC<Omit<Props, 'placeContent'>> = ({ providers }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.9em',
        width: '100%',
      }}
    >
      {Object.keys(providers).map(providerId => (
        <AuthFormComponent
          key={providerId}
          providerId={providerId}
          providerName={providers[providerId].name}
        />
      ))}
    </div>
  )
}

export const AuthComponent: React.FC<Props> = ({ providers, placeContent }) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        columnGap: '1em',
        alignItems: 'center',
      }}
    >
      {placeContent === 'afterLogin' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.3em',
          }}
        >
          <p>Or</p>
        </div>
      )}
      <AuthGroup providers={providers} />
      {placeContent === 'beforeLogin' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '0.3em',
          }}
        >
          <p>Or</p>
        </div>
      )}
    </div>
  )
}
