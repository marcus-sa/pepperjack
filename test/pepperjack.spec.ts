import { expect } from 'chai';
import * as fse from 'fse';

import { Pepperjack, Collection, Column } from '../src';
import { MetadataStorage } from '../src/metadata';
import { Repository } from '../src/repository';
import { ColumnRequiredException } from '../src/exceptions';

describe('Pepperjack', () => {
  let pepperJack: Pepperjack;

  beforeEach(async () => {
    MetadataStorage.empty();
    await fse.rmdir('./test/data');

    pepperJack = new Pepperjack({
      passphrase: 'yaCjUVs6(s^PYtJ{"]<>Cj3G',
      repo: './test/data',
    });

    await pepperJack.start();
  });

  afterEach(async () => {
    await pepperJack.close();
  });

  it('should register collections', async () => {
    @Collection()
    class User {}

    await pepperJack.register([User]);
  });

  it('should get repository', async () => {
    @Collection()
    class User {}

    await pepperJack.register([User]);

    const user = pepperJack.getRepository<User>(User);
    expect(user).to.be.instanceOf(Repository);
  });

  it('should throw required exception', async () => {
    @Collection()
    class User {

      @Column({ required: true })
      public username: string;

      @Column()
      public nickname: string;

    }

    await pepperJack.register([User]);
    const userRepository = pepperJack.getRepository<User>(User);

    const user = new User();
    user.nickname = 'hey';

    expect(async () => {
      await userRepository.save(user);
    }).to.throw(ColumnRequiredException);
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
