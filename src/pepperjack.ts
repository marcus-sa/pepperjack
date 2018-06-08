// Cannot resolve module.exports
import IPFS = require('ipfs');
import { merge } from 'lodash';

import { ObjectType, CollectionKey } from './types';
import { CollectionKeyManager } from './managers';
import { COLLECTION_NAME_METADATA, MetadataStorage } from './metadata';
import { Repository } from './repository';
import { ColumnMetadata, DecoratorMetadata, EmbeddedMetadata, GSMetadata, PepperjackOptions } from './interfaces';
import { getDefaultOptions } from './utils';

export class Pepperjack {

  /**
   * Pepperjack optio
   */
  private readonly options: PepperjackOptions;

  /**
   *  Storing all repositories
   * @type {Map<string, Repository<any>>}
   */
  private readonly repositories = new Map<string, Repository<any>>();
  /**
   * Will be used to encrypt and decrypt file content
   * @type {Map<string, CollectionKeys>}
   */
	public ipfs: IPFS;

  /**
   * Instantiate a new Pepperjack instance
   * @param {PepperjackOptions} options
   */
	constructor(options: PepperjackOptions) {
	  this.options = merge({}, options, getDefaultOptions());
  }

  /**
   * Start the Pepperjack instance
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
    const embeddeds = this.getEmbeddedsByCollection(collection);
    const columns = this.getColumnsByCollection(collection);
    const getters = this.getGettersByCollection(collection);
    const setters = this.getSettersByCollection(collection);

    return new Repository(this.ipfs, collection, key, embeddeds, columns, getters, setters);
  }

  /**
   * Registers all collections
   * @param {ObjectType<any>[]} collections
   * @returns {Promise<[Repository<any> , any]>}
   */
  public async register(collections: ObjectType<any>[]) {
		const keys = await this.ipfs.key.list();
    const collectionKeyManager = new CollectionKeyManager(this.ipfs, keys, this.options);

		const registry = collections.map(async (collection) => {
      const collectionName = this.getCollectionName(collection);
      const key = await collectionKeyManager.register(collectionName);

      // Prevent garbage collecting
      // await this.ipfs.pin.add(key.id);

      const repository = this.createRepository(collection, key);
      this.repositories.set(collectionName, repository);

      return repository;
		});

    return await Promise.all(registry);
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

	private getEmbeddedsByCollection<C>(collection: ObjectType<C>) {
	  return this.getByCollection<EmbeddedMetadata>(MetadataStorage.embeddeds, collection);
  }

	private getColumnsByCollection<C>(collection: ObjectType<C>) {
		return this.getByCollection<ColumnMetadata>(MetadataStorage.columns, collection);
  }

  private getGettersByCollection<C>(collection: ObjectType<C>) {
		return this.getByCollection<GSMetadata>(MetadataStorage.getters, collection);
  }

  private getSettersByCollection<C>(collection: ObjectType<C>) {
    return this.getByCollection<GSMetadata>(MetadataStorage.setters, collection);
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
