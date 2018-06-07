import 'reflect-metadata';
import iterare from 'iterare';
import { expect } from 'chai';

import { Column } from '../../src';
import { MetadataStorage } from '../../src/metadata-storage';
import { MODES } from '../../src/metadata';

describe('@Column', () => {
  beforeEach(() => {
    // Clear column storage on each test
    MetadataStorage.columns.clear();
  });

  /*it('test', () => {
    class Test {
      @Column()
      public _id: string;
    }

    const column = iterare(MetadataStorage.columns).toArray()[0];

    expect(column.options.type).to.equal(String);
  });*/

  it('should guess property design:type', () => {
    class Test {
      @Column()
      public _id: string;
    }

    const columns = iterare(MetadataStorage.columns).toArray();
    expect(columns[0].options.type).to.equal(String);
  });

  it('should set column type with first argument', () => {
    class Test {
      @Column('string')
      public _id: string;
    }

    const columns = iterare(MetadataStorage.columns).toArray();
    expect(columns[0].options.type).to.equal('string');
  })

  /*it('should refuse enhancing class with wrong metadata', () => {
    expect(function () {
      @Collection({ name, hello: 'world' } as any)
      class Users {}
    }).to.throw(Error, "Invalid property 'hello' in @Collection() decorator");
  });*/

});