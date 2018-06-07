// Cannot result module.exports
import paramCase = require('param-case');

import { CollectionOptions } from '../interfaces';
import { defineMetadata } from '../utils';
import { COLLECTION_NAME_METADATA, COLLECTION_REPO_METADATA } from '../metadata';
import { ObjectType } from '../types';

/**
 *
 * @param {CollectionOptions} metadata
 * @returns {ClassDecorator}
 * @constructor
 */
export function Collection<T>(metadata: CollectionOptions = {}): ClassDecorator {
	// Should it really validate?
	// I mean people are forced to use TS
	// so it would be really irrelevant
	// validateMetadata(metadata, ['name'], Collection.name);

	return (target: ObjectType<T>) => {
    if (!metadata.name) metadata.name = paramCase(target.name);

		defineMetadata(target, {
		  [COLLECTION_REPO_METADATA]: metadata.repo,
			[COLLECTION_NAME_METADATA]: metadata.name
		});
	};
}
