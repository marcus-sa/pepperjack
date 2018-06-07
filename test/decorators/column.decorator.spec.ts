import { expect } from 'chai';

import { MetadataStorage } from '../../src/metadata/metadata-storage';
import { MODES } from '../../src/metadata/metadata';
import { Column } from '../../src';

describe('@Column', () => {
  beforeEach(() => {
    // Clear column storage before each test
    MetadataStorage.columns.clear();
  });

  it('should guess type by design:type', () => {
    class Test {
      @Column()
      public _id: string;
    }

    const columns = Array.from(MetadataStorage.columns);
    expect(columns[0].options.type).to.equal(String);
  });

  it('should set type by first argument', () => {
    class Test {
      @Column('string')
      public _id: string;
    }

    const columns = Array.from(MetadataStorage.columns);
    expect(columns[0].options.type).to.equal('string');
  });

  it('should have correct propertyName', () => {
    class Test {
      @Column()
      public _id: string;
    }

    const columns = Array.from(MetadataStorage.columns);
    expect(columns[0].propertyName).to.equal('_id');
  });

  it('should have target be instance of entity', () => {
    class Test {
      @Column()
      public _id: string;
    }

    const columns = Array.from(MetadataStorage.columns);
    expect(columns[0].target).to.be.instanceOf(Test.constructor);
  });

  it('should have correct mode', () => {
    class Test {
      @Column()
      public _id: string;
    }

    const columns = Array.from(MetadataStorage.columns);
    expect(columns[0].mode).to.equal(MODES.REGULAR);
  });

  /*it('should have correct options', () => {
    class Test {
    @Column({ name: 'id' })

    }
  });*/

  /*it('should refuse enhancing class with wrong metadata', () => {
    expect(function () {
      @Collection({ name, hello: 'world' } as any)
      class Users {}
    }).to.throw(Error, "Invalid property 'hello' in @Collection() decorator");
  });*/
});
