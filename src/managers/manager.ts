import { omit } from 'lodash';

import { ColumnManager } from './column.manager';
import { EmbeddedManager } from './embedded.manager';

import { Repositories } from '../types';
import { ColumnMetadata, EmbeddedMetadata } from '../interfaces';

export abstract class Manager {

  public static filterColumns<C>(columns: ColumnMetadata[], collection: C) {
    return Object.keys(collection).filter(
      (property => columns.find(
          (column) => property === column.propertyName)
      )
    );
  }

  public static async assertColumns<C>(columns: ColumnMetadata[], collection: C, storedData) {
    const assertedColumns = columns.map(async (column) => {
      /*const t = collection[column.propertyName];
      console.log(collection, column.propertyName);

      if (Array.isArray(t)) {
        const columnManagers =  t.map(async (data, i) => {
          console.log(column.propertyName, data, i);
          const columnManager = new ColumnManager<C>(column, data[i], storedData);
          return await columnManager.assert();
        });

        return await Promise.all(columnManagers);
      }*/

      const columnManager = new ColumnManager<C>(column, collection, storedData);
      return await columnManager.assert();
    });

    return await Promise.all(assertedColumns);
  }

  public static async assertEmbeddeds<C>(embeddeds: EmbeddedMetadata[], repositories: Repositories, collection: C, storedData) {
    const assertedEmbeddeds = embeddeds.map(async (embedded) => {
      const embeddedMananger = new EmbeddedManager<C>(embedded, repositories, collection, storedData);
      return await embeddedMananger.assert();
    });

    return await Promise.all(assertedEmbeddeds);
  }

  public static validateColumns<C>(data, collectionColumns: string[]) {
    const unknownColumns = omit(data, collectionColumns);

    if (Object.keys(unknownColumns).length > 0) {
      //throw new ColumnUnknownDataColumns(data, collectionColumns);
    }
  }

}