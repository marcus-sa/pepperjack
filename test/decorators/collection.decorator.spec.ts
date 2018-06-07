import paramCase = require('param-case');
import { expect } from 'chai';

import { Collection } from '../../src';
import { COLLECTION_NAME_METADATA, COLLECTION_REPO_METADATA } from '../../src/metadata';

describe('@Collection', () => {
	const name = 'test-collection';

	it('should set property name by class if not specified', () => {
		@Collection()
		class TestBench {}

		const collectionName = Reflect.getMetadata(COLLECTION_NAME_METADATA, TestBench);
		expect(collectionName).to.equal(paramCase(TestBench.name));
	});

	it('should enhance class with expected metadata', () => {
		const repo = './lol';

		@Collection({ name, repo })
		class Test {}

    const collectionName = Reflect.getMetadata(COLLECTION_NAME_METADATA, Test);
    expect(collectionName).to.equal(name);

    const repoName = Reflect.getMetadata(COLLECTION_REPO_METADATA, Test);
    expect(repoName).to.equal(repo);
	});

	/*it('should refuse enhancing class with wrong metadata', () => {
		expect(function () {
			@Collection({ name, hello: 'world' } as any)
			class Users {}
		}).to.throw(Error, "Invalid property 'hello' in @Collection() decorator");
	});*/

});
