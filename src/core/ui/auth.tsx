import React from 'react'
import { Button } from '@payloadcms/ui'
import { OAuth2ProviderConfig, OIDCProviderConfig } from '../../types'
import styles from './styles.module.css'

interface Props {
  providers: Record<string, OAuth2ProviderConfig | OIDCProviderConfig>
  placeContent: 'afterLogin' | 'beforeLogin'
}

const AuthFormComponent: React.FC<{ providerId: string; providerName: string }> = ({
  providerId,
  providerName,
}) => {
  return (
    <form key={providerId} action={`/api/oauth/authorization/${providerId}`} method="GET">
      <Button type="submit" size="medium" className={styles.authBtn}>
        Sign in with {providerName}
      </Button>
    </form>
  )
}

const AuthGroup: React.FC<Omit<Props, 'placeContent'>> = ({ providers }) => {
  return (
    <div className={styles.authBtnGroup}>
      {Object.keys(providers).map(providerId => (
        <AuthFormComponent providerId={providerId} providerName={providers[providerId].name} />
      ))}
    </div>
  )
}

export const AuthComponent: React.FC<Props> = ({ providers, placeContent }) => {
  return (
    <div className={styles.authBlock}>
      {placeContent === 'afterLogin' && (
        <div className={`${styles.authSeparator} ${styles.authSeparatorAfter}`}>
          <p>Or</p>
        </div>
      )}
      <AuthGroup providers={providers} />
      {placeContent === 'beforeLogin' && (
        <div className={`${styles.authSeparator} ${styles.authSeparatorBefore}`}>
          <p>Or</p>
        </div>
      )}
    </div>
  )
}
