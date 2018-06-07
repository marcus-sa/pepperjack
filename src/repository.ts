import { IPFSKey, ObjectType } from './types';
import { ColumnMetadata, GSMetadata } from './interfaces';

export class Repository<C> {

  constructor(
    private readonly collection: ObjectType<C>,
    private readonly key: IPFSKey,
    private readonly columns: ColumnMetadata[],
    private readonly getters: GSMetadata[],
    private readonly setters: GSMetadata[],
  ) {}

  //name?: string;

  public async find() {

  }

  public async findById() {

  }

  public async get() {

  }

  private getColumnKeys() {
    return this.columns.map(column => column.propertyName);
  }

  public async save(collection: C/* | C[]*/) {
    // Convert to array if not already
    /*collection = !Array.isArray(collection)
      ? [collection]
      : collection;*/

    const executors = [collection].map(entity => {
      const data = this.getColumnKeys()
        .reduce((columns, column) => ({
          ...columns,
          [column]: collection[column]
        }), {});

      //console.log(this.columns, this.setters);

      //console.log(data, entity);
    });

    return await Promise.all(executors);
  }


}
