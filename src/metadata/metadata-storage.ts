import { ColumnMetadata } from '../interfaces';

export abstract class MetadataStorage {

  public static columns = new Set<ColumnMetadata>();

}
