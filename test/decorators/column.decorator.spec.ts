import { expect } from 'chai';

import { MODES, MetadataStorage } from '../../src/metadata';
import { Column } from '../../src';

describe('@Column', () => {
  beforeEach(() => {
    // Clear column storage before each data
    MetadataStorage.empty();
  });

  describe('-> Column metadata', () => {

    it('should guess native type by design:type', () => {
      class User {

        @Column()
        public _id: string;

      }

      const columns = Array.from(MetadataStorage.columns);
      expect(columns[0].options.type).to.equal(String);
    });

    // Unfortunately it doesn't work with array of class
    it('should be able to define class as design:type', () => {
      class Post {}

      class User {

        @Column()
        public posts: Post

      }

      const columns = Array.from(MetadataStorage.columns);
      expect(columns[0].options.type).to.deep.equal(Post);
    });

    it('should set type by first argument', () => {
      class User {

        @Column('string')
        public _id: string;

      }

      const columns = Array.from(MetadataStorage.columns);
      expect(columns[0].options.type).to.equal('string');
    });

    it('should have correct propertyName', () => {
      class User {

        @Column()
        public _id: string;

      }

      const columns = Array.from(MetadataStorage.columns);
      expect(columns[0].propertyName).to.equal('_id');
    });

    it('should have target be instance of collection', () => {
      class User {

        @Column()
        public _id: string;

      }

      const columns = Array.from(MetadataStorage.columns);
      expect(columns[0].target).to.equal(User);
    });

    it('should have correct mode', () => {
      class Test {
        @Column()
        public _id: string;
      }

      const columns = Array.from(MetadataStorage.columns);
      expect(columns[0].mode).to.equal(MODES.REGULAR);
    });
  });

  describe('-> Embedded metadata', () => {

  });
});
