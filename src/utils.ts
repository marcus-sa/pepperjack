import { ObjectType, Metadata } from './types';
import { PepperjackOptions } from './interfaces';

export class Utils {
  public static loggers = new Set();

  /**
   * Defines metadata on a target
   * @param {ObjectType<T>} target
   * @param {Metadata} metadata
   */
  public static defineMetadata<T>(target: ObjectType<T>, metadata: Metadata) {
    Object.keys(metadata || {}).forEach(key => {
      Reflect.defineMetadata(key, metadata[key], target);
    });
  }

  public static getDefaultOptions = (): PepperjackOptions => ({
    pass: '', // should be defined by user
    dev: process.env.NODE_ENV !== 'production',
    keys: {
      type: 'rsa',
      size: 2048,
    },
  });

  public static toArray = arr => (!Array.isArray(arr) ? [arr] : arr);

  /*export function hasIn(obj: object, keys: string[], filter: (keys: string[], key: string) => boolean) {
    Object.keys(obj).filter(
      (key) => filter(keys, key)
    ).reduce((data, key) => ({
      ...data,
      [key]: obj[key],
    }), {});
  }

  export function pick(obj, keys) {
    return Utils.hasIn(obj, keys, (keys, key) => keys.includes(key));
  }

  export function omit(obj, keys) {
    return Utils.hasIn(obj, keys, (keys, key) => !keys.includes(key));
  }*/
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
