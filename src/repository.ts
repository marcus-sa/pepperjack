import IPFS from 'ipfs';

import { Manager } from './managers';
import { Utils } from './utils';

import { CollectionKey, ObjectType, Repositories } from './types';
import { ColumnMetadata, EmbeddedMetadata, GSMetadata } from './interfaces';

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

  public async find(idOrClause: string | number | { rand: any }) {}

  /*public async findByPrimaryKey() {

  }*/

  public async get() {}

  /*private getColumnKeys() {
    return this.columns.map(column => column.propertyName);
  }*/

  /**
   * Save (insert/update) a collection to the database
   * @param {C[] | C} collections
   * @returns {Promise<any[]>}
   */
  public async save(collections: C | C[]) {
    return Promise.all(
      Utils.toArray(collections).map(async collection => {
        // fake
        const storedData = {};
        const insertColumns = Manager.filterMetadata<ColumnMetadata[], C>(
          this.columns,
          collection,
        );
        Manager.validateColumns(collection, insertColumns);

        await Manager.assertColumns(this.columns, collection, storedData);
        await Manager.assertEmbeddeds(
          this.embeddeds,
          /*this.repositories,*/ collection,
          storedData,
        );
      }),
    );

    //return await Promise.all(executors);
  }
}
