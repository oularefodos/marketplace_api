import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from './dto/create-user.dto';

describe("UsersController", () => {
    let controller: UsersController;
    let service: UsersService;
    let serviceMock = {
      create : jest.fn((user) => user),
      findAll : jest.fn(() => [user]),
      findOneById : jest.fn((id) => user),
      remove : jest.fn((id) => user),
      update: jest.fn((id, user) => user),
    };
    const user: CreateUserDto = {
      email: "test@gmail.com",
      password: "123456",
  };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService, PrismaService],
        })
            .overrideProvider(UsersService)
            .useValue(serviceMock)
            .compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("Users", () => {
        describe("create", () => {
            it("should be defined", () => {
                expect(controller.create).toBeDefined();
            });
            it('should call service.create', async () => {
              await controller.create(user);
              expect(service.create).toHaveBeenCalledWith(user);
            });
            it ('should return UserCreated', async () => {
              const response = await controller.create(user);
              expect(response).toBe(user);
            })
        });
        describe("findAll", () => {
            it("should be defined", () => {
                expect(controller.findAll).toBeDefined();
            });
            it('should call service.findAll', async () => {
              await controller.findAll();
              expect(service.findAll).toHaveBeenCalled();
            });
            it ('should return a list of user', async () => {
              const response = await controller.findAll();
              expect(response).toEqual([user]);
            })
        });
        describe("findOne", () => {
            it("should be defined", () => {
                expect(controller.findOne).toBeDefined();
            });
            it('should call service.findOneById', async () => {
              await controller.findOne('id');
              expect(service.findOneById).toHaveBeenCalledWith('id');
            });
            it ('should return a user', async () => {
              const response = await controller.findOne('id');
              expect(response).toEqual(user);
            })
        });
        describe("update", () => {
            it("should be defined", () => {
                expect(controller.update).toBeDefined();
            });
            it('should call service.update', async () => {
              await controller.update('id', user);
              expect(service.update).toHaveBeenCalledWith('id', user);
            });
            it ('should return an updated user', async () => {
              const response = await controller.update('id', user);
              expect(response).toEqual(user);
            })
        });
        describe("remove", () => {
            it("should be defined", () => {
                expect(controller.remove).toBeDefined();
            });
            it('should call service.remove', async () => {
              await controller.remove('id');
              expect(service.remove).toHaveBeenCalledWith('id');
            });
            it ('should return a user', async () => {
              const response = await controller.remove('id');
              expect(response).toEqual(user);
            })
        });
    });
});
