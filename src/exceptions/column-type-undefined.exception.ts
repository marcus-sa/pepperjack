/**
 * Thrown when ORM cannot get column's type automatically.
 * Basically, when reflect-metadata is not available or tsconfig is not properly setup.
 */
import { Model } from '../model';

export class ColumnTypeUndefinedException extends Error {

  constructor(target: Model, propertyName: string) {
    super(`Column type for ${target.constructor.name}#${propertyName} is not defined and cannot be guessed.`);
  }

}