import { Manager } from './manager';
import { Pepperjack } from '../pepperjack';

import { EmbeddedMetadata } from '../interfaces';
import { ObjectType, Repositories } from '../types';
import { MetadataStorage } from '../metadata';

export class EmbeddedManager<Data> {

  private readonly type: ObjectType<any>;

  constructor(
    private readonly embedded: EmbeddedMetadata,
    private readonly repositories: Repositories,
    private readonly insertData: Data,
    private readonly storedData: Data,
  ) {
    this.type = this.embedded.type();
  }

  private getEmbeddedData() {
    return this.insertData[this.embedded.propertyName];
  }

  private async recursiveCheck() { // async
    const embeddeds = MetadataStorage.getEmbeddedsByCollection(this.type);
    console.log(embeddeds);

    const embeddedManagers = embeddeds.map(embedded => {
      // async / await
      console.log('recursiveCheck', this.insertData[embedded.propertyName]);
      return Manager.assertEmbeddeds(embeddeds, this.repositories, this.insertData[embedded.propertyName], this.storedData);
    });

    return Promise.all(embeddedManagers); // await
  }

  private checkArray() {
    if (this.embedded.isArray && !Array.isArray(this.getEmbeddedData())) {
      throw new Error('checkArray');
      //throw new EmbeddedMustBeArrayException()
    }
  }

  public async assert() {
    this.checkArray();
    //const collectionName = Pepperjack.getCollectionName(this.embedded.target);
    //const repository = this.repositories.get(collectionName);
    const columns = MetadataStorage.getColumnsByCollection(this.type);
    const currentColumnData = this.getEmbeddedData();

    if (this.embedded.isArray) {
      const executors = currentColumnData.map(insertData => {
        return Manager.assertColumns(columns, insertData, this.storedData);
      });

      return Promise.all(executors);
    }

    await Manager.assertColumns(columns, currentColumnData, this.storedData);

    // Recursive embeddeds
    return this.recursiveCheck();
  }

}
