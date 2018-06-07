import IPFS from 'ipfs';

import { ObjectType } from './types';
import { MetadataStorage } from './metadata/metadata-storage';
import { Repository } from './repository';
import { ColumnMetadata, PepperjackOptions } from './interfaces';

export class Pepperjack {

	//private nodes: any[];
	//private models: Entity[];

	constructor(
		private readonly ipfs: IPFS,
		private readonly options?: PepperjackOptions
	) {}

	public async start() {

  }

	public findCollectionByNode() {

	}

	private getColumnsByCollection<C>(collection: ObjectType<C>): ColumnMetadata[] {
	  // or use iterare
	  return Array.from(MetadataStorage.columns).filter(
      (column) => column.target instanceof collection.constructor
    );
  }

	public getRepository<C>(collection: ObjectType<C>/* | string*/): Repository<C> {
	  const columns = this.getColumnsByCollection<C>(collection);

	  return new Repository<C>(collection, columns);
  }

	public findCollectionsByRepo() {

	}

}
