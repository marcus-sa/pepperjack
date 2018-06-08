import { ObjectType } from '../types';
import { MetadataStorage } from '../metadata';

/**
 *
 * @param {string} column
 * @returns {MethodDecorator}
 * @constructor
 */
export function Setter(column: string): MethodDecorator {
  return (target: ObjectType<any>, propertyName: string) => {
    //Reflect.defineMetadata(COLUMN_GETTER_METADATA, true, target, propertyName);

    MetadataStorage.setters.add({
      target: target.constructor,
      propertyName,
      column,
    });
  };
}
