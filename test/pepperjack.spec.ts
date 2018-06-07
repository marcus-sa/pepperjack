import { expect } from 'chai';

import { Pepperjack, Collection, Column } from '../src';
import { MetadataStorage } from '../src/metadata/metadata-storage';
import { Repository } from '../src/repository';

describe('Pepperjack', () => {
  let pepperJack: Pepperjack;

  beforeEach(() => {
    // Clear column storage before each test
    MetadataStorage.columns.clear();
  });

  before(() => {
    pepperJack = new Pepperjack(null);
  });

  it('should get repository', async () => {
    @Collection()
    class User {}

    const user = pepperJack.getRepository<User>(User);
    expect(user).to.be.instanceOf(Repository);
  })
});
