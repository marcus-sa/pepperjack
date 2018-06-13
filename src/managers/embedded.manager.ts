import { pick, omit } from 'lodash';

import { MetadataStorage } from '../metadata';
import { Manager } from './manager';

import { EmbeddedMetadata, ColumnMetadata } from '../interfaces';
import { ObjectType, Repositories } from '../types';
import { Utils } from '../utils';

export class EmbeddedManager<Data> {
  private readonly type: ObjectType<any>;

  constructor(
    private readonly embedded: EmbeddedMetadata,
    //private readonly repositories: Repositories,
    private readonly insertData: Data,
    private readonly storedData: Data,
  ) {
    this.type = this.embedded.type();
  }

  private getEmbeddedData() {
    return this.insertData[this.embedded.propertyName];
  }

  /**
   * Recursively traverse through embeddeds that are related to this collection
   *
   * @param {Data} data
   * @returns {Promise<Promise<[Promise<[void , any]> , any]>>}
   */
  private async traverse(data: Data) {
    const embeddeds = MetadataStorage.getEmbeddedsByCollection(this.type);
    return Manager.assertEmbeddeds(embeddeds, data, this.storedData);
  }

  private checkArray() {
    if (this.embedded.isArray && !Array.isArray(this.getEmbeddedData())) {
      throw new Error('checkArray');
      //throw new EmbeddedMustBeArrayException()
    }
  }

  public async assert() {
    this.checkArray();

    const columns = MetadataStorage.getColumnsByCollection(this.type);
    const currentColumnData = Utils.toArray(this.getEmbeddedData());

    return Promise.all(
      currentColumnData.map(async insertData => {
        const insertColumns = Manager.filterMetadata<ColumnMetadata[], Data>(
          columns,
          insertData,
        );
        Manager.validateColumns(insertData, insertColumns);

        const pickedData = pick(insertData, insertColumns);
        await Manager.assertColumns(columns, pickedData, this.storedData);

        const leftOverData = omit(insertData, insertColumns);
        if (Object.keys(leftOverData).length > 0) {
          await this.traverse(leftOverData);
        }
      }),
    );
  }
}
