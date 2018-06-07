// Cannot resolve module.exports
import IPFS = require('ipfs');

import { ObjectType, IPFSKey, CollectionKey } from './types';
import { COLLECTION_NAME_METADATA, MetadataStorage } from './metadata';
import { Repository } from './repository';
import { ColumnMetadata, DecoratorMetadata, PepperjackOptions } from './interfaces';

export class Pepperjack {

  /**
   *  Storing all repositories
   * @type {Map<string, Repository<any>>}
   */
  private repositories = new Map<string, Repository<any>>();
  /**
   * Will be used to encrypt and decrypt file content
   * @type {Map<string, CollectionKeys>}
   */
	private ipfsKeys = new Map<string, CollectionKey>();
	public ipfs: IPFS;

	constructor(
		//private readonly ipfs: IPFS,
		private readonly options: PepperjackOptions
	) {}

  /**
   * Starts the Pepperjack instance
   * @returns {Promise<any>}
   */
	public start() {
		return new Promise((resolve) => {
      this.ipfs = new IPFS({
        pass: this.options.passphrase,
        repo: this.options.repo,
      });

      this.ipfs.on('ready', () => {
      	resolve(this.ipfs);
      });
		});
  }

  /**
   * Destroy Pepperjack
   * @returns {Promise<void>}
   */
  public async close() {
	  await this.ipfs.stop();
  }

  /**
   * Create a repository
   * @param {ObjectType<C>} collection
   * @param {CollectionKey} key
   * @returns {Repository<any>}
   */
  public createRepository<C>(collection: ObjectType<C>, key: CollectionKey) {
    const columns = this.getColumnsByCollection(collection);
    const getters = this.getGettersByCollection(collection);
    const setters = this.getSettersByCollection(collection);

    return new Repository(this.ipfs, collection, key, columns, getters, setters);
  }

  /**
   * Registers all collections
   * @param {ObjectType<any>[]} collections
   * @returns {Promise<[Repository<any> , any]>}
   */
  public async register(collections: ObjectType<any>[]) {
		const keys = await this.ipfs.key.list() || [];

		const registry = collections.map(async (collection) => {
      const collectionName = this.getCollectionName(collection);
      const key = await this.registerKey(collectionName, keys);

      // Prevent garbage collecting
      // await this.ipfs.pin.add(key.id);

      const repository = this.createRepository(collection, key);
      this.repositories.set(collectionName, repository);

      return repository;
		});

    return await Promise.all(registry);
  }

  /**
   * Registers IPFS keys for each collection
   * @param {string} collectionName
   * @param {IPFSKey[]} keys
   * @returns {Promise<CollectionKey>}
   */
  private async registerKey(collectionName: string, keys: IPFSKey[]) {
		let ipfsKey = this.findCollectionKey(collectionName, keys);

    if (!ipfsKey) {
      ipfsKey = await this.ipfs.key.gen(collectionName, {
        type: 'rsa',
        size: 2048,
      });
    }

    const privateKey = await this.ipfs.key.export(collectionName, this.options.passphrase);

    const data = {
      id: ipfsKey.id,
      key: privateKey,
    } as CollectionKey;

    this.ipfsKeys.set(collectionName, data);

    return data;
  }

  /**
   * Find key in collection by name
   * @param {string} collectionName
   * @param {IPFSKey[]} keys
   * @returns {IPFSKey | undefined}
   */
  private findCollectionKey<C>(collectionName: string, keys: IPFSKey[]) {
		return keys.find(key => key.name === collectionName);
  }

  /**
   * Get's the collection name
   * @param {ObjectType<C>} collection
   * @returns {any}
   */
  public getCollectionName<C>(collection: ObjectType<C>) {
    return Reflect.getMetadata(COLLECTION_NAME_METADATA, collection);
  }

  /**
   * Get metadata properties by collection
   * @param {Set<S extends DecoratorMetadata>} store
   * @param {ObjectType<any>} collection
   * @returns {S[]}
   */
	private getByCollection<S extends DecoratorMetadata>(
		store: Set<S>,
		collection: ObjectType<any>
	): S[] {
		return Array.from(store).filter(
			(value) => value.target instanceof collection.constructor
		);
	}

	private getColumnsByCollection<C>(collection: ObjectType<C>) {
		return this.getByCollection<ColumnMetadata>(MetadataStorage.columns, collection);
  }

  private getGettersByCollection<C>(collection: ObjectType<C>) {
		return this.getByCollection(MetadataStorage.getters, collection);
  }

  private getSettersByCollection<C>(collection: ObjectType<C>) {
    return this.getByCollection(MetadataStorage.setters, collection);
  }

  /**
   * Gets specified repository by collection
   * @param {ObjectType<C>} collection
   * @returns {Repository<C>}
   */
	public getRepository<C>(collection: ObjectType<C>): Repository<C> {
		const collectionName = this.getCollectionName(collection);
		/*if (!this.repositories.has(collectionName)) {
      const columns = this.getColumnsByCollection<C>(collection);
      const getters = this.getGettersByCollection<C>(collection);
      const setters = this.getSettersByCollection<C>(collection);

      const key: IPFSKey = await this.ipfs.gen(collectionName, {
      	// should be in options
      	type: 'rsa',
	      size: 4096
      });

      return ;
		}*/

		return this.repositories.get(collectionName);
  }

}
