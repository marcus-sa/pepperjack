import IPFS from 'ipfs';

import { IPFSKey, CollectionKey } from '../types';
import { PepperjackOptions } from '../interfaces';

export class CollectionKeyManager {

  private readonly collectionKeys = new Map<string, CollectionKey>();

  constructor(
    private readonly ipfs: IPFS,
    private readonly ipfsKeys: IPFSKey[] = [],
    private readonly options: PepperjackOptions,
  ) {}

  /**
   * Generate an IPFS key
   * @param {string} collectionName
   * @returns {Promise<IPFSKey>}
   */
  private async generateIpfsKey(collectionName: string) {
    return await this.ipfs.key.gen(collectionName, this.options.keys) as IPFSKey;
  }

  /**
   * Generate a private key
   * @param {string} collectionName
   * @returns {Promise<any>}
   */
  private async generatePrivateKey(collectionName: string) {
    return await this.ipfs.key.export(collectionName, this.options.pass);
  }

  /**
   * Register IPFS and Collection key
   * @param {string} collectionName
   * @returns {Promise<CollectionKey>}
   */
  public async register(collectionName: string) {
    const ipfsKey = this.findIpfsKey(collectionName) || await this.generateIpfsKey(collectionName);
    const privateKey = await this.generatePrivateKey(collectionName);

    const data = {
      id: ipfsKey.id,
      key: privateKey,
    } as CollectionKey;

    this.collectionKeys.set(collectionName, data);
    return data;
  }

  /**
   * Get a collection key
   * @param {string} collectionName
   * @returns {CollectionKey | undefined}
   */
  public get<C>(collectionName: string) {
    return this.collectionKeys.get(collectionName);
  }

  /**
   * Find a IPFS key
   * @param {string} collectionName
   * @returns {IPFSKey | undefined}
   */
  private findIpfsKey<C>(collectionName: string) {
    return this.ipfsKeys.find(key => key.name === collectionName);
  }

}
