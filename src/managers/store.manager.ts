import IPFS from 'ipfs';

import { CollectionKey } from '../types';

export class StoreManager<C> {
  constructor(
    private readonly ipfs: IPFS,
    private readonly collection: C,
    private readonly collectionKey: CollectionKey,
  ) {}

  public getCollection() {}
}
