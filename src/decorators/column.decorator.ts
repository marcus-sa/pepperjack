import { ColumnEmbeddedOptions, ColumnOptions } from '../interfaces';
import { ObjectType, ColumnType, TypeOrOptions, EmbeddedType } from '../types';
import { ColumnTypeUndefinedException } from '../exceptions';
import { MODES, MetadataStorage, COLLECTION_REPO_METADATA } from '../metadata';

// @TODO: Add custom validation option
/**
 *
 * @param {TypeOrOptions} typeOrOptions
 * @param {ColumnOptions & ColumnEmbeddedOptions} options
 * @returns {PropertyDecorator}
 * @constructor
 */
export function Column(
	typeOrOptions?: TypeOrOptions,
	options?: (ColumnOptions & ColumnEmbeddedOptions)
): PropertyDecorator {
	return (target: ObjectType<any>, propertyName: string) => {
    // normalize parameters
		let type: ColumnType | undefined;
		if (typeof typeOrOptions === 'string') {
			type = <ColumnType> typeOrOptions;
		} else if (typeOrOptions) {
			options = <ColumnOptions> typeOrOptions;
			type = (typeOrOptions as ColumnOptions).type;
		}

		if (!options) options = {} as ColumnOptions;

    // if type is not given explicitly then try to guess it
		const reflectMetadataType = Reflect.getMetadata('design:type', target, propertyName);
		if (!type && reflectMetadataType) type = reflectMetadataType;

		// determine if it is an array
		const isArray = reflectMetadataType === Array || !!options.array;

		if (typeOrOptions instanceof Function) {
			MetadataStorage.embeddeds.add({
				target: target.constructor,
				prefix: options.prefix,
				type: typeOrOptions as EmbeddedType,
        propertyName,
				isArray,
			});
		} else {
      // check if there is no type in column options then set type from first function argument, or guessed one
      if (!options.type && type) options.type = type;
      if (!options.array && isArray) options.array = true;
      //if (!options.validator && validator) options.validator = validator;
      if (!options.type) throw new ColumnTypeUndefinedException(target, propertyName);

      MetadataStorage.columns.add({
        target: target.constructor,
        mode: MODES.REGULAR,
        propertyName,
        options,
      });
		}
	};
}
