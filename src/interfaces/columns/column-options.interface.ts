import { ColumnCustomValidator, ColumnType, ObjectType } from '../../types';

export interface ColumnOptions {

  type: ColumnType;
  collection?: keyof ObjectType<any>;
	name?: string;
	validator?: ColumnCustomValidator;
	array?: boolean;

}
