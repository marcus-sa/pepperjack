import 'reflect-metadata';
import { expect } from 'chai';

import { COLLECTION_NAME_METADATA } from '../../src/metadata';
import { Collection } from '../../src';

describe('@Collection', () => {
	const name = 'test-collection';

	it('should enhance class with expected metadata', () => {
		@Collection({ name })
		class Test {}

		const collectionName = Reflect.getMetadata(COLLECTION_NAME_METADATA, Test);
		expect(collectionName).to.equal(name);
	});

	/*it('should refuse enhancing class with wrong metadata', () => {
		expect(function () {
			@Collection({ name, hello: 'world' } as any)
			class Users {}
		}).to.throw(Error, "Invalid property 'hello' in @Collection() decorator");
	});*/

});