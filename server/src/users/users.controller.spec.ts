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
        describe("POST / - create user", () => {
            it("should be defined", () => {
                expect(controller.create).toBeDefined();
            });
            it('should call service.create', async () => {
              await controller.create(user);
              expect(service.create).toHaveBeenCalled();
            });
            it ('should return UserCreated', async () => {
              const response = await controller.create(user);
              expect(response).toBe(user);
            })
        });
    });
});
