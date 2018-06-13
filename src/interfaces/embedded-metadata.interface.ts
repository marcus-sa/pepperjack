import { DecoratorMetadata } from './decorator-metadata.interface';
import { EmbeddedType } from '../types';

export interface EmbeddedMetadata extends DecoratorMetadata {
  isArray: boolean;
  type: EmbeddedType;
  prefix?: string | boolean;
}
