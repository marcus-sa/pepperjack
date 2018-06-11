import { ObjectType } from '../types';
import { MetadataStorage/*, COLUMN_GETTER_METADATA*/ } from '../metadata';

/**
 *
 * @param {string} column
 * @returns {MethodDecorator}
 * @constructor
 */
export function Getter(column: string): MethodDecorator {
  return (target: ObjectType<any>, propertyName: string) => {
    MetadataStorage.getters.add({
      target: target.constructor,
      propertyName,
      column,
    });
  };
}
