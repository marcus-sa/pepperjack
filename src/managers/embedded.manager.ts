import { EmbeddedMetadata } from '../interfaces';
import { Repositories } from '../types';
import { Repository } from '../repository';
import { Pepperjack } from '../pepperjack';

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
      return await Repository.manageEmbeddeds(embeddeds, this.repositories, this.insertData[embedded.propertyName], this.storedData);
    });

    return await Promise.all(embeddedManagers);
  }

  public async assert() {
    //const collectionName = Pepperjack.getCollectionName(this.embedded.target);
    //const repository = this.repositories.get(collectionName);

    const columns = Pepperjack.getColumnsByCollection(this.embedded.target);
    await Repository.manageColumns(columns, this.embedded.target, this.insertData, this.storedData);

    // Recursive embeddeds
    await this.recursiveCheck();
  }

}
