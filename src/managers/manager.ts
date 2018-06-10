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

  public static async assertColumns<C>(columns: ColumnMetadata[], collection: C, insertData, storedData) {
    const assertedColumns = columns.map(async (column) => {
      const columnManager = new ColumnManager<C>(column, insertData, storedData);
      return await columnManager.assert();
    });

    return await Promise.all(assertedColumns);
  }

  public static async assertEmbeddeds<C>(embeddeds: EmbeddedMetadata[], repositories: Repositories, insertData, storedData) {
    const assertedEmbeddeds = embeddeds.map(async (embedded) => {
      const embeddedMananger = new EmbeddedManager<C>(embedded, repositories, insertData, storedData);
      return await embeddedMananger.assert();
    });

    return await Promise.all(assertedEmbeddeds);
  }

}