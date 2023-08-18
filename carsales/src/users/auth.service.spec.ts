import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      find: (email) => {
        const filter = users.filter((x) => x.email === email);
        return Promise.resolve(filter);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);

        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create instannce', async () => {
    expect(service).toBeDefined();
  });

  it('create a user with salted and hashed pass', async () => {
    const user = await service.signup('test.com', 'dsadf');

    expect(user.password).not.toEqual('dsadf');
    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws error if signup email is in use', async () => {
    await service.signup('test.com', 'dsadf');

    await expect(service.signup('test.com', 'dsadf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws error if signin email not in use', async () => {
    fakeUsersService.find = () => Promise.resolve([]);

    await expect(service.sigin('test.com', 'dsadf')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws error if signin password isinvalid', async () => {
    await service.signup('test.com', 'dsadf');

    await expect(service.sigin('test.com', 'dsadfff')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns user if correct password is provided', async () => {
    await service.signup('test.com', 'dsadf');

    const user = await service.sigin('test.com', 'dsadf');
    expect(user).toBeDefined();
  });
});
