import 'reflect-metadata';
import { expect } from 'chai';

import { COLLECTION_NAME_METADATA } from '../metadata';
import { Collection } from './collection.decorator';

describe('@Collection', () => {
	const name = 'test-collection';

	it('should define metadata name', () => {
		@Collection({ name })
		class Users {}

		const collectionName = Reflect.getMetadata(COLLECTION_NAME_METADATA, Users);
		expect(collectionName).to.equal(name);
	});

	it('should refuse wrong metadata property', () => {
		expect(function () {
			@Collection({ name, hello: 'world' } as any)
			class Users {}
		}).to.throw(Error, "Invalid property 'hello' in @Collection() decorator");
	});

});