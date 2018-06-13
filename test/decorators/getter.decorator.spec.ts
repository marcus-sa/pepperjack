import { expect } from 'chai';

import { Collection, Column, Getter } from '../../src';
import { MetadataStorage } from '../../src/metadata';

describe('@Getter', () => {
  beforeEach(() => {
    // Clear column storage before each data
    MetadataStorage.empty();
  });

  it('should have correct propertyName', () => {
    class User {
      @Getter('_id')
      private getId() {}
    }

    const getters = Array.from(MetadataStorage.getters);
    expect(getters[0].propertyName).to.equal('getId');
  });

  it('should have target be equal to collection', () => {
    class User {
      @Getter('_id')
      private getId() {}
    }

    const getters = Array.from(MetadataStorage.getters);
    expect(getters[0].target).to.equal(User);
  });

  it('should not exist on instantiated collection', () => {
    class User {
      @Getter('_id')
      private modifyId() {}
    }

    const user = new User();

    const getters = Array.from(MetadataStorage.getters);
    expect(user).not.to.have.key(getters[0].propertyName);
  });
});
