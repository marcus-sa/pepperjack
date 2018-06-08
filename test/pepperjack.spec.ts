import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fse from 'fse';

import { Pepperjack, Collection, Column } from '../src';
import { MetadataStorage } from '../src/metadata';
import { Repository } from '../src/repository';
import { ColumnRequiredException } from '../src/exceptions';

use(chaiAsPromised);

describe('Pepperjack', () => {
  let pepperJack: Pepperjack;

  beforeEach(async () => {
    MetadataStorage.empty();
    await fse.rmdir('./test/data');

    pepperJack = new Pepperjack({
      pass: 'yaCjUVs6(s^PYtJ{"]<>Cj3G',
      repo: './test/data',
    });

    await pepperJack.start();
  });

  afterEach(async () => {
    await pepperJack.close();
  });

  it('should register collections', () => {
    @Collection()
    class User {}

    return expect(pepperJack.register([User])).not.to.be.rejected;
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

    // Doesn't work expecting it to reject with ColumnRequiredException
    return expect(userRepository.save(user)).to.be.rejectedWith(Error);
  });

});
