// Cannot resolve module.exports
import 'reflect-metadata';
import IPFS = require('ipfs');
import { merge } from 'lodash';

import { RepositoryUnknownException } from './exceptions';
import { COLLECTION_NAME_METADATA, MetadataStorage } from './metadata';
import { CollectionKeyManager } from './managers';
import { Repository } from './repository';
import { Utils } from './utils';

import { ObjectType, CollectionKey, Repositories } from './types';
import { PepperjackOptions } from './interfaces';

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
	  this.options = merge({}, Utils.getDefaultOptions(), options);
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

  public createRepository(collection: ObjectType<any>, key: CollectionKey) {
    const embeddeds = MetadataStorage.getEmbeddedsByCollection(collection);
    const columns = MetadataStorage.getColumnsByCollection(collection);
    const getters = MetadataStorage.getGettersByCollection(collection);
    const setters = MetadataStorage.getSettersByCollection(collection);

    return new Repository(this.ipfs, this.repositories, collection, key, embeddeds, columns, getters, setters);
  }

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
  public static getCollectionName(collection: Function) {
    return Reflect.getMetadata(COLLECTION_NAME_METADATA, collection); //collection.constructor
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
