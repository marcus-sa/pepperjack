import { ColumnType } from '../../types';

export interface ColumnOptions {

  /**
   * Column type. Must be one of the value from the ColumnTypes class.
   */
  type?: ColumnType;

  /**
   * Default database value.
   */
  default?: any;

  /**
   * Column name in the database.
   */
	name?: string;

  /**
   * Indicates if this column is an array.
   * Can be simply set to true or array length can be specified.
   */
	array?: boolean;

  /**
   * Specifies if column's value must be unique or not.
   */
	unique?: boolean;

  /**
   * Indicates if this column is a primary key.
   * Same can be achieved when @PrimaryColumn decorator is used.
   */
	primary?: boolean;

  /**
   * Indicates if this column is required when inserting.
   * Is true by default.
   */
  required?: boolean;

}
