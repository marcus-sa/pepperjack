import { omit } from 'lodash';

import { ColumnManager } from './column.manager';
import { EmbeddedManager } from './embedded.manager';

import { Repositories } from '../types';
import { ColumnMetadata, DecoratorMetadata, EmbeddedMetadata } from '../interfaces';

export namespace Manager {

  export function filterMetadata<MD extends DecoratorMetadata[], C>(metadata: MD, collection: C) {
    return Object.keys(collection).filter(
      (column => metadata.find(
          (property) => column === property.propertyName)
      )
    );
  }

  export async function assertColumns<C>(columns: ColumnMetadata[], collection: C, storedData) {
    return Promise.all(columns.map((column) => {
      const columnManager = new ColumnManager<C>(column, collection, storedData);
      return columnManager.assert();
    }));
  }

  export async function assertEmbeddeds<C>(embeddeds: EmbeddedMetadata[], /*repositories: Repositories,*/ collection: C, storedData) {
    return Promise.all(embeddeds.map((embedded) => {
      const embeddedMananger = new EmbeddedManager<C>(embedded, /*repositories,*/ collection, storedData);
      return embeddedMananger.assert();
    }));
  }

  export function validateColumns<C>(collection, columns: string[]) {
    const unknownColumns = omit(collection, columns);

    if (Object.keys(unknownColumns).length > 0) {
      //throw new ColumnUnknownDataColumns(data, collectionColumns);
    }
  }

}
