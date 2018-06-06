import { CollectionOptions } from '../interfaces';
import { defineMetadata, validateMetadata } from '../utils';
import { COLLECTION_NAME_METADATA } from '../metadata';
import { Model } from '../model';

/*export const collectionMetadataKeys = [
	'name'
];*/

export function Collection(metadata: CollectionOptions): ClassDecorator {
	// Should it really validate?
	// I mean people are forced to use TS
	// so it would be really irrelevant
	validateMetadata(metadata, ['name'], Collection.name);

	return (target: Model) => {
		defineMetadata(target,{
			[COLLECTION_NAME_METADATA]: metadata.name
		});
	};
}