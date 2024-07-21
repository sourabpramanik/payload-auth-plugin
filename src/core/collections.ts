import type { CollectionConfig } from 'payload'

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
        name: 'issuerName',
        type: 'text',
        required: true,
        label: 'Issuer Name',
      },
      {
        name: 'scope',
        type: 'text',
        required: true,
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
