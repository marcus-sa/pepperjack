import { ColumnMetadata } from './interfaces';
import { ColumnRequiredException } from './exceptions';

// @TODO: Clean this garbage up
export class ColumnManager<T> implements ColumnMetadata {

  constructor(
    public readonly target,
    public readonly propertyName,
    public readonly mode,
    public readonly options,
    public value: any,
  ) {}

  private required() {
    if (this.options.required && !this.value) {
      throw new ColumnRequiredException(this.target, this.propertyName);
    }
  }

  private default() {
    if (this.options.default && !this.value) {
      this.value = this.options.default;
    }
  }

  public async assert() {
    this.required();
    this.default();

    return this;
  }

}