import {
  ColumnMetadata,
  GSMetadata,
  EmbeddedMetadata,
  DecoratorMetadata,
} from '../interfaces';

export abstract class MetadataStorage {
  public static embeddeds = new Set<EmbeddedMetadata>();

  public static columns = new Set<ColumnMetadata>();

  public static getters = new Set<GSMetadata>();

  public static setters = new Set<GSMetadata>();

  public static empty() {
    this.embeddeds.clear();
    this.columns.clear();
    this.getters.clear();
    this.setters.clear();
  }

  private static getByCollection<S extends DecoratorMetadata>(
    metadata: Set<S>,
    collection: Function,
  ): S[] {
    return Array.from(metadata).filter(
      value =>
        value.target ===
        collection /*||
        value.target.name === collection.name*/,
    );
  }

  public static getEmbeddedsByCollection(collection: Function) {
    return this.getByCollection<EmbeddedMetadata>(this.embeddeds, collection);
  }

  public static getColumnsByCollection(collection: Function) {
    return this.getByCollection<ColumnMetadata>(this.columns, collection);
  }

  public static getGettersByCollection(collection: Function) {
    return this.getByCollection<GSMetadata>(this.getters, collection);
  }

  public static getSettersByCollection(collection: Function) {
    return this.getByCollection<GSMetadata>(this.setters, collection);
  }
}
