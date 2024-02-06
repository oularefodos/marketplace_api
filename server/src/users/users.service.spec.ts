import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcryptUtils from "../../utils/passwordEncryptor";
import { User } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { createPrismaMocker } from "../../utils/prismaMock";

const encryptedPassword = uuidv4();
const id: string = "60d5922d00581b8f0062e3a8";

const user: CreateUserDto = {
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

    let dbMock = createPrismaMocker(users, userResponse, "user");

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService, PrismaService],
        })
            .overrideProvider(PrismaService)
            .useValue(dbMock)
            .compile();

        service = module.get<UsersService>(UsersService);
        db = module.get<PrismaService>(PrismaService);
        dbMock.mockClear();
        const encryptedPassMock = jest
            .spyOn(bcryptUtils, "encryptPassword")
            .mockReturnValue(encryptedPassword);
        encryptedPassMock.mockClear();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("createUser", () => {
        it("should call the function db.user.create", async () => {
            await service.create(user);
            expect(db.user.create).toHaveBeenCalled();
            expect(db.user.create).toHaveBeenCalledWith({
                data: {
                    email: user.email,
                    password: encryptedPassword,
                },
            });
            expect(db.user.create).toHaveReturnedWith(userResponse);
        });
        it("should call the password Encryptor", async () => {
            await service.create(user);
            expect(bcryptUtils.encryptPassword).toHaveBeenCalled();
            expect(bcryptUtils.encryptPassword).toHaveBeenCalledWith(
                user.password,
            );
            expect(bcryptUtils.encryptPassword).toHaveReturnedWith(
                encryptedPassword,
            );
        });
        it("should call db.user.findUnique", async () => {
            await service.create(user);
            expect(db.user.findUnique).toHaveBeenCalled();
            expect(db.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: user.email,
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
            const response = await service.create(user);
            expect(response).toBeDefined();
            expect(response).toEqual(userResponse);
        });
    });

    describe("findAll", () => {
        it("should be defined", () => {
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

    describe("findOneById", () => {
        it("should be defined", () => {
            expect(service.findOneById).toBeDefined();
        });
        it("should call the function db.user.findUnique", async () => {
            await service.findOneById(id);
            expect(db.user.findUnique).toHaveBeenCalled();
            expect(db.user.findUnique).toHaveBeenCalledWith({ where: { id } });
            expect(db.user.findUnique).toHaveReturnedWith(users[0]);
        });
        it("shoud return User", async () => {
            const response = await service.findOneById(id);
            expect(response).toBeDefined();
            expect(response).toEqual(users[0]);
        });
        it("should be return null for if the user does not exist", async () => {
            expect(async () => {
                await service.findOneById("hello");
            }).rejects.toThrow(NotFoundException);
        });
    });

    describe("findOneByEmail", () => {
        const email = "test0@gmail.com";
        it("should be defined", () => {
            expect(service.findOneByEmail).toBeDefined();
        });
        it("should call the function db.user.findUnique", async () => {
            await service.findOneByEmail(email);
            expect(db.user.findUnique).toHaveBeenCalled();
            expect(db.user.findUnique).toHaveBeenCalledWith({
                where: { email },
            });
            expect(db.user.findUnique).toHaveReturnedWith(users[0]);
        });
        it("shoud return User", async () => {
            const response = await service.findOneByEmail(email);
            expect(response).toBeDefined();
            expect(response).toEqual(users[0]);
        });
        it("should return null if the user does not exist", async () => {
            expect(async () => {
                await service.findOneByEmail("test00000@gmail.com");
            }).rejects.toThrow(NotFoundException);
        });
    });

    describe("update", () => {
        it("should be defined", () => {
            expect(service.update).toBeDefined();
        });
        it("should call the function db.user.findUnique", async () => {
            await service.update(id, user);
            expect(db.user.findUnique).toHaveBeenCalled();
            expect(db.user.findUnique).toHaveBeenCalledWith({
                where: { id: id },
            });
            expect(db.user.findUnique).toHaveReturnedWith(users[0]);
        });
        it("should throw an NotFundException", async () => {
            expect(async () => {
                await service.update("kk", user);
            }).rejects.toThrow(NotFoundException);
        });
        it("should encrypt the password if it is present", async () => {
            await service.update(id, {
                email: "test@gmail.com",
                password: "kkklllll",
            });
            expect(bcryptUtils.encryptPassword).toHaveBeenCalled();
            expect(bcryptUtils.encryptPassword).toHaveBeenCalledWith(
                "kkklllll",
            );
            expect(bcryptUtils.encryptPassword).toHaveReturnedWith(
                encryptedPassword,
            );
        });
        it("should not password encryptor if the password is undefined", async () => {
            await service.update(id, { email: "test@gmail.com" });
            expect(bcryptUtils.encryptPassword.length).toBe(0);
        });
        it("should throw if the payload is undefind", async () => {
            expect(async () => {
                await service.update(id, undefined);
            }).rejects.toThrow(ForbiddenException);
        });
        it("should call the db.user.update", async () => {
            await service.update(id, user);
            expect(db.user.update).toHaveBeenCalled();
            expect(db.user.update).toHaveBeenCalledWith({
                where: { id },
                data: user,
            });
        });
        it("should return the same data sent", async () => {
            const response = await service.update(id, user);
            for (let key in user) {
                expect(response[key]).toEqual(user[key]);
            }
        });
    });

    describe("remove", () => {
        it("sould be defined", () => {
            expect(service.remove).toBeDefined();
        });
        it("should call findUnique", async () => {
            await service.remove(id);
            expect(db.user.findUnique).toHaveBeenCalled();
            expect(db.user.findUnique).toHaveBeenCalledWith({
                where: { id: id },
            });
            expect(db.user.findUnique).toHaveReturnedWith(users[0]);
        });
        it("should call db.user.delete", async () => {
            await service.remove(id);
            expect(db.user.delete).toHaveBeenCalled();
            expect(db.user.delete).toHaveBeenCalledWith({
                where: { id: id },
            });
            expect(db.user.delete).toHaveReturnedWith(users[0]);
        });
        it("should return the user deleted", async () => {
            const response = await service.remove(id);
            expect(response.id).toBe(id);
        });
        it("should throw an error if the index does not exist", async () => {
            expect(async () => {
                await service.remove("lll");
            }).rejects.toThrow(NotFoundException);
        });
    });
});

