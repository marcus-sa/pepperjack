/**
* Thrown when ORM cannot get column's type automatically.
* Basically, when reflect-metadata is not available or tsconfig is not properly setup.
*/
import { ObjectType } from '../types';

export class ColumnTypeUndefinedException extends Error {

  constructor(target: ObjectType<any>, propertyName: string) {
    super(`Column type for ${target.name}#${propertyName} is not defined and cannot be guessed.`);
  }

}
