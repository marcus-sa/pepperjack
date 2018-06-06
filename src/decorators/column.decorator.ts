import { ColumnOptions } from '../interfaces';



export function Column(metadata: ColumnOptions): PropertyDecorator {
	return (target: object, key: string) => {
		console.log(target, key);
	};
}