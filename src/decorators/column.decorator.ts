import { ColumnOptions } from '../interfaces';
import { ObjectType, ColumnType } from '../types';
import { MODES } from '../metadata/metadata';
import { MetadataStorage } from '../metadata/metadata-storage';
import { ColumnTypeUndefinedException } from '../exceptions';

export function Column(typeOrOptions?: ColumnOptions | ColumnType, options?: ColumnOptions): PropertyDecorator {
	return (target: ObjectType<any>, propertyName: string) => {
    // normalize parameters
		let type: ColumnType | undefined;
		if (typeof typeOrOptions === 'string') {
			type = <ColumnType> typeOrOptions;
		} else if (typeOrOptions) {
			options = <ColumnOptions> typeOrOptions;
			type = typeOrOptions.type;
		}

		if (!options) options = {} as ColumnOptions;

    // if type is not given explicitly then try to guess it
		const reflectMetadataType = Reflect.getMetadata('design:type', target, propertyName);
		if (!type && reflectMetadataType) type = reflectMetadataType;

    // check if there is no type in column options then set type from first function argument, or guessed one
		if (!options.type && type) options.type = type;
		if (!options.type) throw new ColumnTypeUndefinedException(target, propertyName);

		MetadataStorage.columns.add({
			target: target.constructor,
      mode: MODES.REGULAR,
			propertyName,
			options,
		});
	};
}
