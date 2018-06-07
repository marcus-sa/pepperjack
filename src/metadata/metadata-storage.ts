import { ColumnMetadata, GSMetadata, EmbeddedMetadata } from '../interfaces';

export abstract class MetadataStorage {

  /**
   * Embedded columns for collections
   * @type {Set<EmbeddedMetadata>}
   */
  public static embeddeds = new Set<EmbeddedMetadata>();

  /**
   * Columns for collections
   * @type {Set<ColumnMetadata>}
   */
  public static columns = new Set<ColumnMetadata>();

  /**
   * Getters for collections
   * @type {Set<GSMetadata>}
   */
  public static getters = new Set<GSMetadata>();

  /**
   * Setters for collections
   * @type {Set<GSMetadata>}
   */
  public static setters = new Set<GSMetadata>();

  /**
   * Clears all stored metadata
   */
  public static empty() {
    this.embeddeds.clear();
    this.columns.clear();
    this.getters.clear();
    this.setters.clear();
  }

}
