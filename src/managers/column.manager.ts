import { isEqual } from 'lodash';

import { ColumnMetadata } from '../interfaces/index';
import { ColumnRequiredException } from '../exceptions/index';

// @TODO: Clean this garbage up
export class ColumnManager<D> {

  constructor(
    private readonly column: ColumnMetadata,
    private readonly insertData: D[],
    private readonly storedData: D[],
  ) {}

  private getColumnValue() {
    return this.insertData[this.column.propertyName];
  }

  private setColumnValue(value: any) {
    this.insertData[this.column.propertyName] = value;
  }

  private required() {
    if (this.column.options.required && !this.getColumnValue()) {
      throw new ColumnRequiredException(this.column.target, this.column.propertyName);
    }
  }

  private default() {
    if (this.column.options.default && !this.getColumnValue()) {
      this.setColumnValue(this.column.options.default);
    }
  }

  private unique() {
    const value = this.getColumnValue();

    if (this.column.options.unique && value) {
      const notUnique = this.storedData.find(
        (columns) => isEqual(columns[this.column.propertyName], value)
      );

      /*if (notUnique) {
        throw new ColumnUniqueException(this.column.target, this.column.propertyName);
      }*/
    }
  }

  public async assert() {
    this.required();
    //this.unique();
    this.default();

    return this;
  }

}
