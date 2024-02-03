import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcryptUtils from "../../utils/passwordEncryptor";
import { User } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { ForbiddenException } from "@nestjs/common";

const encryptedPassword = uuidv4();

const User: CreateUserDto = {
    email: "test@gmail.com",
    password: "123456",
};

const UserResponse: User = {
    id: uuidv4(),
    email: "test@gmail.com",
    role: "USER",
    password: encryptedPassword,
};

const Users: User[] = [
    {
        id: uuidv4(),
        email: "test0@gmail.com",
        role: "USER",
        password: encryptedPassword,
    },
    {
        id: uuidv4(),
        email: "test1@gmail.com",
        role: "USER",
        password: encryptedPassword,
    },
    {
        id: uuidv4(),
        email: "test2@gmail.com",
        role: "USER",
        password: encryptedPassword,
    },
];

describe("UsersService", () => {
    let service: UsersService;
    let db: PrismaService;

    let dbMock = {
        user: {
            create: jest.fn(() => UserResponse),
            delete: jest.fn(),
            findOne: jest.fn(),
            findUnique: jest.fn((params) =>
                Users.find((user) => user.email === params.where.email),
            ),
            findMany: jest.fn(),
            update: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService, PrismaService],
        })
            .overrideProvider(PrismaService)
            .useValue(dbMock)
            .compile();

        service = module.get<UsersService>(UsersService);
        db = module.get<PrismaService>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("createUser", () => {
        jest.spyOn(bcryptUtils, "encryptPassword").mockReturnValueOnce(
            encryptedPassword,
        );
        it("should call the function db.user.create", async () => {
            await service.create(User);
            expect(db.user.create).toHaveBeenCalled();
            expect(db.user.create).toHaveBeenCalledWith({
                data: {
                    email: User.email,
                    password: encryptedPassword,
                },
            });
            expect(db.user.create).toHaveReturnedWith(UserResponse);
        });
        it("should call the password Encryptor", async () => {
            await service.create(User);
            expect(bcryptUtils.encryptPassword).toHaveBeenCalled();
            expect(bcryptUtils.encryptPassword).toHaveBeenCalledWith(
                User.password,
            );
            expect(bcryptUtils.encryptPassword).toHaveReturnedWith(
                encryptedPassword,
            );
        });
        it("should throw an Error if the email already exits", async () => {
            await service.create(User);
            expect(db.user.findUnique).toHaveBeenCalled();
            expect(db.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: User.email,
                },
            });
        });
        it("should throw an Error if the email already exists", async () => {
            expect(async () => {
                await service.create({
                    email: "test1@gmail.com",
                    password: "1234567",
                });
            }).rejects.toThrow(ForbiddenException);
        });
        it("should return the user created", async () => {
            const response = await service.create(User);
            expect(response).toBeDefined();
            expect(response).toEqual(UserResponse);
        });
    });
});
