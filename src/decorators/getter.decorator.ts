import { ObjectType } from '../types';
import { MetadataStorage/*, COLUMN_GETTER_METADATA*/ } from '../metadata';

/**
 *
 * @param {string} column
 * @returns {MethodDecorator}
 * @constructor
 */
export function Getter(column: string): MethodDecorator {
  return (target: ObjectType<any>, methodName: string) => {
    //Reflect.defineMetadata(COLUMN_GETTER_METADATA, true, target, propertyName);

    MetadataStorage.getters.add({
      target: target.constructor,
      methodName,
      column,
    });
  };
}