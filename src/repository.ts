import IPFS from 'ipfs';

import { CollectionKey, ObjectType } from './types';
import { ColumnMetadata, EmbeddedMetadata, GSMetadata } from './interfaces';
import { ColumnManager } from './managers';

export class Repository<C> {

  constructor(
    private readonly ipfs: IPFS,
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

  private getColumnKeys() {
    return this.columns.map(column => column.propertyName);
  }

  private filterDataByColumns(collection: C) {
    return Object.keys(collection).filter(
      (property => this.columns.find(
        (column) => property === column.propertyName)
      )
    );
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
      const insertColumns = this.filterDataByColumns(collection);
      const insertData = insertColumns.map(column => collection[column]);

      const assertedColumns = this.columns.map(async (column) => {
        //const value = data[column.propertyName];

        const columnManager = new ColumnManager<C>(column, insertData, null);
        return await columnManager.assert();
      });

      return await Promise.all(assertedColumns);
    });

    return await Promise.all(executors);
  }

}
