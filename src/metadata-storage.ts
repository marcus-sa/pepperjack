import { Model } from './model';
import { ColumnOptions } from './interfaces';
import { MODES } from './metadata';

export interface MetadataStorageSet {
  target: Model;
  propertyName: string;
  mode: MODES;
  options: ColumnOptions;
}

export abstract class MetadataStorage {

  public static columns = new Set<MetadataStorageSet>();

}