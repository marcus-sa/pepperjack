import { ColumnOptions } from './column-options.interface';
import { DecoratorMetadata } from '../decorator-metadata.interface';
import { MODES } from '../../metadata/index';

export interface ColumnMetadata extends DecoratorMetadata {
  mode: MODES;
  options: ColumnOptions;
}
