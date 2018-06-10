import IPFS from 'ipfs';

import { CollectionKey, ObjectType, Repositories } from './types';
import { ColumnMetadata, EmbeddedMetadata, GSMetadata } from './interfaces';
import { Manager } from './managers';

export class Repository<C> {

  constructor(
    private readonly ipfs: IPFS,
    private readonly repositories: Repositories,
    private readonly collection: ObjectType<C>,
    private readonly key: CollectionKey,
    private readonly embeddeds: EmbeddedMetadata[],
    private readonly columns: ColumnMetadata[],
    private readonly getters: GSMetadata[],
    private readonly setters: GSMetadata[],
  ) {}

  //name?: string;

  public async find() {

  }

  public async findById() {

  }

  public async get() {

  }

  /*private getColumnKeys() {
    return this.columns.map(column => column.propertyName);
  }*/

  /**
   * Save (insert/update) a collection to the database
   * @param {C[] | C} collections
   * @returns {Promise<any[]>}
   */
  public async save(collections: C | C[]) {
    // Convert to array if not already
    collections = !Array.isArray(collections)
      ? [collections]
      : collections;

    // @TODO: Clean this garbage pseudo code up
    const executors = collections.map(async (collection) => {
      // fake
      const storedData = {};
      const insertColumns = Manager.filterColumns<C>(this.columns, collection);
      const insertData = insertColumns.map(column => collection[column]);

      await Manager.assertColumns(this.columns, collection, insertData,storedData);
      await Manager.assertEmbeddeds(this.embeddeds, this.repositories, insertData, storedData);

      //return await Promise.all([columns, embeddeds]);
    });

    return await Promise.all(executors);
  }

}
