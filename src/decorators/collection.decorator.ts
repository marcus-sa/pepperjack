import paramCase = require('param-case');

import { CollectionOptions } from '../interfaces';
import { Utils } from '../utils';
import { ObjectType } from '../types';
import {
	COLLECTION_NAME_METADATA,
	COLLECTION_REPO_METADATA,
	COLLECTION_EMBEDDED_METADATA
} from '../metadata';

/**
 * Define class as a collection
 * @param {CollectionOptions} options
 * @returns {ClassDecorator}
 */
export function Collection<T>(options: CollectionOptions = {}): Function {
	// Should it really validate?
	// I mean people are forced to use TS
	// so it would be really irrelevant
	// validateMetadata(metadata, ['name'], Collection.name);

	return (target: ObjectType<T>) => {
    const collectionName = paramCase(options.name || target.name)

		Utils.defineMetadata(target, { // collection.constructor
		  [COLLECTION_REPO_METADATA]: options.repo,
			[COLLECTION_NAME_METADATA]: collectionName,
			[COLLECTION_EMBEDDED_METADATA]: options.embedded
		});
	};
}
