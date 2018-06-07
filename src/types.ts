export type CustomColumnType = any;

export type ColumnType = 'float' | 'string' | 'boolean' | 'date';// | any[] | { [prop: string]: any } | CustomColumnType;

export type Metadata = { [key: string]: any; };

export type ObjectType<T> = { new(...args: any[]): T } | Function;
