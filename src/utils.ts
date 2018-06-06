import { Metadata } from './types';

export function validateMetadata(metadata: Metadata, metadataKeys: string[], name?: string) {
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

export function defineMetadata(target: object, metadata: Metadata) {
	Object.keys(metadata || {}).forEach(key => {
		Reflect.defineMetadata(key, metadata[key], target);
	})
}