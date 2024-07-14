import type { CollectionConfig } from 'payload/types'

export function generateAccountsCollection(
  accountsCollectionSlug: string,
  usersCollectionSlug: string,
): CollectionConfig {
  const accountsCollection: CollectionConfig = {
    slug: accountsCollectionSlug,
    admin: {
      useAsTitle: 'id',
    },
    access: {
      read: () => true,
      create: () => true,
      update: () => true,
      delete: () => true,
    },
    fields: [
      {
        name: 'name',
        type: 'text',
      },
      {
        name: 'picture',
        type: 'text',
      },
      {
        name: 'user',
        type: 'relationship',
        relationTo: usersCollectionSlug,
        hasMany: false,
        required: true,
        label: 'User',
      },
      {
        name: 'provider',
        type: 'text',
        required: true,
      },
      {
        name: 'access_token',
        type: 'text',
        label: 'Access Token',
      },
      {
        name: 'expires_at',
        type: 'date',
        label: 'Expires At',
      },
      {
        name: 'scope',
        type: 'text',
      },
      {
        name: 'sub',
        type: 'text',
        required: true,
      },
    ],
  }
  return accountsCollection
}
