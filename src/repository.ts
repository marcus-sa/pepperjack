import { ObjectType } from './types';
import { ColumnMetadata } from './interfaces';

export class Repository<C> {

  constructor(
    private readonly collection: ObjectType<C>,
    private readonly columns: ColumnMetadata[],
  ) {}

  //name?: string;

  public async find() {

  }

  public async findById() {

  }

  public async get() {

  }

  public async save(collection: C | C[]) {

  }


}
