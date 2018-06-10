import { Manager } from './manager';
import { Pepperjack } from '../pepperjack';

import { EmbeddedMetadata } from '../interfaces';
import { Repositories } from '../types';

export class EmbeddedManager<D> {

  constructor(
    private readonly embedded: EmbeddedMetadata,
    private readonly repositories: Repositories,
    private readonly insertData: D[],
    private readonly storedData: D[],
  ) {}

  private async recursiveCheck() {
    const embeddeds = Pepperjack.getEmbeddedsByCollection(this.embedded.target);

    const embeddedManagers = embeddeds.map(async (embedded) => {
      return await Manager.assertEmbeddeds(embeddeds, this.repositories, this.insertData[embedded.propertyName], this.storedData);
    });

    return await Promise.all(embeddedManagers);
  }

  private checkArray() {
    if (this.embedded.isArray && !Array.isArray(this.insertData)) {
      throw new Error();
      //throw new EmbeddedMustBeArrayException()
    }
  }

  public async assert() {
    this.checkArray();
    //const collectionName = Pepperjack.getCollectionName(this.embedded.target);
    //const repository = this.repositories.get(collectionName);

    const columns = Pepperjack.getColumnsByCollection(this.embedded.target);
    await Manager.assertColumns(columns, this.embedded.target, this.insertData, this.storedData);

    // Recursive embeddeds
    await this.recursiveCheck();
  }

}
