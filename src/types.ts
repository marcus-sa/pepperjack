import { ColumnEmbeddedOptions, ColumnOptions } from './interfaces';
import { Repository } from './repository';

export type ColumnType = 'int' | 'number' | 'float' | 'string' | 'boolean' | 'date';

export type Metadata = { [key: string]: any; };

export type ObjectType<T> = { new(): T }//; | Function;

export type EmbeddedType = (type?: any) => ObjectType<any>;

export type TypeOrOptions = ColumnType | EmbeddedType | (ColumnOptions & ColumnEmbeddedOptions);

export type IPFSKey = {
  id: string;
  name: string;
};

export type CollectionKey = {
  id: string;
  key: string;
};

export type Repositories = Map<string, Repository<any>>;

//export type ColumnCustomValidator = (columnValue: string) => Promise<any> | boolean;