// Cannot resolve module.exports
import IPFS = require('ipfs');
import { merge } from 'lodash';

import { RepositoryUnknownException } from './exceptions';
import { COLLECTION_NAME_METADATA, MetadataStorage } from './metadata';
import { CollectionKeyManager } from './managers';
import { Repository } from './repository';
import { getDefaultOptions } from './utils';

import { ObjectType, CollectionKey, Repositories } from './types';
import { ColumnMetadata, DecoratorMetadata, EmbeddedMetadata, GSMetadata, PepperjackOptions } from './interfaces';

export class Pepperjack {

  /**
   * Pepperjack options
   */
  private readonly options: PepperjackOptions;

  /**
   *  Storing all repositories
   * @type {Map<string, Repository<any>>}
   */
  private readonly repositories: Repositories = new Map();
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
	  this.options = merge({}, getDefaultOptions(), options);
  }

  /**
   * Start the Pepperjack instance
   * @returns {Promise<any>}
   */
	public start() {
		return new Promise((resolve) => {
      this.ipfs = new IPFS({
        pass: this.options.pass,
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
    const embeddeds = Pepperjack.getEmbeddedsByCollection(collection);
    const columns = Pepperjack.getColumnsByCollection(collection);
    const getters = Pepperjack.getGettersByCollection(collection);
    const setters = Pepperjack.getSettersByCollection(collection);

    return new Repository(this.ipfs, this.repositories, collection, key, embeddeds, columns, getters, setters);
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
      const collectionName = Pepperjack.getCollectionName(collection);
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
  public static getCollectionName<C>(collection: ObjectType<C>) {
    return Reflect.getMetadata(COLLECTION_NAME_METADATA, collection); //collection.constructor
  }

	public static getByCollection<S extends DecoratorMetadata>(
		metadata: Set<S>,
		target: Function,
	): S[] {
		return Array.from(metadata).filter(
			(value) => value.target instanceof target
		);
	}

	public static getEmbeddedsByCollection<C>(collection: ObjectType<C>) {
	  return Pepperjack.getByCollection<EmbeddedMetadata>(MetadataStorage.embeddeds, collection.constructor);
  }

  public static getColumnsByCollection<C>(collection: ObjectType<C>) {
		return Pepperjack.getByCollection<ColumnMetadata>(MetadataStorage.columns, collection.constructor);
  }

  public static getGettersByCollection<C>(collection: ObjectType<C>) {
		return Pepperjack.getByCollection<GSMetadata>(MetadataStorage.getters, collection.constructor);
  }

  public static getSettersByCollection<C>(collection: ObjectType<C>) {
    return Pepperjack.getByCollection<GSMetadata>(MetadataStorage.setters, collection.constructor);
  }

  /**
   * Gets specified repository by collection
   * @param {ObjectType<C>} collection
   * @returns {Repository<C>}
   */
	public getRepository<C>(collection: ObjectType<C>): Repository<C> {
		const collectionName = Pepperjack.getCollectionName(collection);

		if (!this.repositories.has(collectionName)) {
		  throw new RepositoryUnknownException(collectionName);
    }

		return this.repositories.get(collectionName) as Repository<C>;
  }

}
