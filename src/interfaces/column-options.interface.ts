import { ColumnType, ObjectType } from '../types';

export interface ColumnOptions {

  type: ColumnType;
  collection?: ObjectType<any>;
	name?: string;

}
