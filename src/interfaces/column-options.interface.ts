import { Model } from '../model';
import { ColumnType } from '../types';

export interface ColumnOptions {

	type: ColumnType;
	collection?: Model;

}