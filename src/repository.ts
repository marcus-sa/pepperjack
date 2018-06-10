import IPFS from 'ipfs';

import { CollectionKey, ObjectType, Repositories } from './types';
import { ColumnMetadata, EmbeddedMetadata, GSMetadata } from './interfaces';
import { ColumnManager, EmbeddedManager } from './managers';

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

  public static filterColumns<C>(columns: ColumnMetadata[], collection: C) {
    return Object.keys(collection).filter(
      (property => columns.find(
        (column) => property === column.propertyName)
      )
    );
  }

  public static async manageColumns<C>(columns: ColumnMetadata[], collection: C, insertData, storedData) {
    const assertedColumns = columns.map(async (column) => {
      const columnManager = new ColumnManager<C>(column, insertData, storedData);
      return await columnManager.assert();
    });

    return await Promise.all(assertedColumns);
  }

  public static async manageEmbeddeds<C>(embeddeds: EmbeddedMetadata[], repositories: Repositories, insertData, storedData) {
    const assertedEmbeddeds = embeddeds.map(async (embedded) => {
      const embeddedMananger = new EmbeddedManager<C>(embedded, repositories, insertData, storedData);
      return await embeddedMananger.assert();
    });

    return await Promise.all(assertedEmbeddeds);
  }

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
      const insertColumns = Repository.filterColumns<C>(this.columns, collection);
      const insertData = insertColumns.map(column => collection[column]);

      await Repository.manageColumns(this.columns, collection, insertData,storedData);
      await Repository.manageEmbeddeds(this.embeddeds, this.repositories, insertData, storedData);

      //return await Promise.all([columns, embeddeds]);
    });

    return await Promise.all(executors);
  }

}
