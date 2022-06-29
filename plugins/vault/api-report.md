## API Report File for "@backstage/plugin-vault"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
/// <reference types="react" />

import { ApiRef } from '@backstage/core-plugin-api';
import { BackstagePlugin } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';

// @public
export const EntityVaultCard: () => JSX.Element;

// @public
export function isVaultAvailable(entity: Entity): boolean;

// @public (undocumented)
export const VAULT_SECRET_PATH_ANNOTATION = 'vault.io/secrets-path';

// @public
export interface VaultApi {
  listSecrets(secretPath: string): Promise<VaultSecret[]>;
}

// @public (undocumented)
export const vaultApiRef: ApiRef<VaultApi>;

// @public
export const vaultPlugin: BackstagePlugin<{}, {}>;

// @public
export type VaultSecret = {
  name: string;
  showUrl: string;
  editUrl: string;
};

// (No @packageDocumentation comment for this package)
```