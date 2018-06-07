import { ColumnOptions } from './column-options.interface';
import { MODES } from '../metadata/metadata';

export interface ColumnMetadata {
  target: Function;
  propertyName: string;
  mode: MODES;
  options: ColumnOptions;
}
