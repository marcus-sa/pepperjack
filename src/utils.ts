import { ObjectType, Metadata } from './types';
import { ColumnMetadata, PepperjackOptions } from 'src/interfaces';

export abstract class Utils {

  /**
   * Defines metadata on a target
   * @param {ObjectType<T>} target
   * @param {Metadata} metadata
   */
  static defineMetadata<T>(target: ObjectType<T>, metadata: Metadata) {
    Object.keys(metadata || {}).forEach(key => {
      Reflect.defineMetadata(key, metadata[key], target);
    })
  }

  static getDefaultOptions = (): PepperjackOptions => ({
    pass: '', // should be defined by user
    keys: {
      type: 'rsa',
      size: 2048
    }
  });

}

/*export function validateMetadata(metadata: Metadata, metadataKeys: string[], name?: string) {
	Object.keys(metadata || {}).forEach(key => {
		if (metadataKeys.includes(key)) return;

		throw new Error(`Invalid property '${key}' in @${name}() decorator`);
	})
}

export function getMetadataByKeys(target: object, keys: string[]) {
	return keys.reduce<Metadata>((metadata, key) => ({
		...metadata,
		[key]: Reflect.getOwnMetadata(key, target) // Reflect.getMetadata?
	}), {});
}

export function getMetadata<T>(target: ObjectType<T>) {
	return Reflect.getMetadataKeys(target)
		.reduce<Metadata>((metadata, key) => ({
			...metadata,
			[key]: Reflect.getMetadata(key, target)
		}), {})
}*/