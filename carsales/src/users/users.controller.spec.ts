import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeAuthService = {
      // sigin: () => {},
      // signup: () => {}
    };
    fakeUsersService = {
      findOne: (id) => {
        return Promise.resolve({
          id,
          email: 'dadfads',
          password: 'asdfdadf',
        } as User);
      },
      find: () => {
        return Promise.resolve([
          { id: 1, email: 'dadfads', password: 'asdfdadf' } as User,
        ]);
      },
      remove: (id) => {
        return Promise.resolve({
          id,
          email: 'dadfads',
          password: 'asdfdadf',
        } as User);
      },
      //update: () => {}
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getUsers returns list of user', async () => {
    const users = await controller.getAll('adfasd');

    expect(users.length).toEqual(1);
  });

  it('getUser returns user', async () => {
    const users = await controller.getUser('1');

    expect(users).toBeDefined();
  });
});
