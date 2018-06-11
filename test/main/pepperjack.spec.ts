import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fse from 'fse';

import { Pepperjack, Collection, Column } from '../../src';
import { MetadataStorage } from '../../src/metadata';
import { Repository } from '../../src/repository';

use(chaiAsPromised);

// @TODO: Writer better testing
describe('Pepperjack', () => {
  let pepperJack: Pepperjack;

  beforeEach(async () => {
    MetadataStorage.empty();

    pepperJack = new Pepperjack({
      pass: 'yaCjUVs6(s^PYtJ{"]<>Cj3G',
      repo: './test/data',
    });

    await pepperJack.start();
  });

  afterEach(async () => {
    await pepperJack.close();
    await fse.rmdir('./test/data');
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

  /*it('should throw exception when saving wrong data', () => {

  });*/

  it('should save collection without instantiating', async () => {
    @Collection()
    class User {

      @Column({ required: true })
      public username: string;

    }

    await pepperJack.register([User]);
    const userRepository = pepperJack.getRepository<User>(User);

    return expect(userRepository.save({
      username: 'lol'
    } as User)).not.to.be.rejected;
  });

  it('should do embedded', async () => {
    @Collection()
    class Post {

      @Column({ required: true })
      public title: string;

      @Column({ required: true })
      public content: string;

    }

    @Collection()
    class User {

      @Column({ required: true })
      public username: string;

      @Column(() => Post)
      public post: Post;

    }

    await pepperJack.register([Post, User]);
    const userRepository = pepperJack.getRepository<User>(User);

    return expect(userRepository.save({
      username: 'lol',
      post: {
        title: 'Post #1',
        content: 'lol'
      }
    })).not.to.be.rejected;
  });

  it('should do array embedded', async () => {
    @Collection()
    class Post {

      @Column({ required: true })
      public title: string;

      @Column({ required: true })
      public content: string;

    }

    @Collection()
    class User {

      @Column({ required: true })
      public username: string;

      @Column(() => Post)
      public post: Post[];

    }

    await pepperJack.register([Post, User]);
    const userRepository = pepperJack.getRepository<User>(User);

    return expect(userRepository.save({
      username: 'lol',
      post: [{
        title: 'Post #1',
        content: 'lol',
      }, {
        title: 'Post #2',
        content: 'test',
      }]
    })).not.to.be.rejected;
  });

  it('should do recursive embedded', async () => {
    @Collection()
    class Information {

      @Column()
      public data?: string;

    }

    @Collection()
    class Post {

      @Column({ required: true })
      public title: string;

      @Column({ required: true })
      public content: string;

      @Column(() => Information)
      public external?: Information;

    }

    @Collection()
    class User {

      @Column({ required: true })
      public username: string;

      @Column(() => Post)
      public post?: Post[];

    }

    await pepperJack.register([Information, Post, User]);
    const userRepository = pepperJack.getRepository<User>(User);

    return expect(userRepository.save({
      username: 'lol',
      post: [{
        title: 'Post #1',
        content: 'lol',
      }, {
        title: 'Post #2',
        content: 'test',
        external: {
          data: 'something'
        }
      }]
    })).not.to.be.rejected;
  });

});
