/**
 * Thrown when ORM cannot get column's type automatically.
 * Basically, when reflect-metadata is not available or tsconfig is not properly setup.
 */
import { ObjectType } from '../../types';

export class ColumnRequiredException extends Error {

  constructor(target: ObjectType<any>, propertyName: string) {
    super(`Column ${propertyName} is required in ${target.name}!`);
  }

}
