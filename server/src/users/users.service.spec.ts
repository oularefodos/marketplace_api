import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcryptUtils from "../../utils/passwordEncryptor";
import { User } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { ForbiddenException } from "@nestjs/common";
import { createPrismaMocker } from "../../utils/prismaMock";

const encryptedPassword = uuidv4();
const id: string = "60d5922d00581b8f0062e3a8";

const User: CreateUserDto = {
    email: "test@gmail.com",
    password: "123456",
};

const userResponse: User = {
    id: uuidv4(),
    email: "test@gmail.com",
    role: "USER",
    password: encryptedPassword,
};

const users: User[] = [
    {
        id: "60d5922d00581b8f0062e3a8",
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

    let dbMock = createPrismaMocker(users, userResponse, 'user')

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
            expect(db.user.create).toHaveReturnedWith(userResponse);
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
            expect(response).toEqual(userResponse);
        });
    });

    describe("findAll", () => {
        it("hould be defined", () => {
            expect(service.findAll).toBeDefined();
        });
        it("should call the function db.user.findMany", async () => {
            await service.findAll();
            expect(db.user.findMany).toHaveBeenCalled();
            expect(db.user.findMany).toHaveReturnedWith(users);
        });
        it("shoud return Users", async () => {
            const response = await service.findAll();
            expect(response).toBeDefined();
            expect(response).toEqual(users);
        });
    });
});
