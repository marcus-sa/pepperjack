import { expect } from 'chai';

import { Pepperjack, Collection, Column } from '../src';
import { MetadataStorage } from '../src/metadata';
import { Repository } from '../src/repository';

describe('Pepperjack', () => {
  let pepperJack: Pepperjack;

  beforeEach(() => {
    MetadataStorage.empty();
    pepperJack = new Pepperjack({
      passphrase: 'yaCjUVs6(s^PYtJ{"]<>Cj3G',
    });
  });

  afterEach(async () => {
    await pepperJack.destroy();
  });

  it('should register repositories', async () => {
    @Collection()
    class User {}

    await pepperJack.start();
    await pepperJack.register([User]);
  });

  it('should get repository', async () => {
    @Collection()
    class User {}

    await pepperJack.start();
    await pepperJack.register([User]);

    const user = pepperJack.getRepository<User>(User);
    expect(user).to.be.instanceOf(Repository);
  });

  /*it('should save new collection', async () => {
    @Collection()
    class User {

      @Column((id: any) => typeof id === 'number')
      public id: number;

    }

    const userRepository = pepperJack.getRepository<User>(User);

    const user = new User();
    user.id = 1;

    await userRepository.save(user);
  });*/

});
