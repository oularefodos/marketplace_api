import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "../prisma/prisma.service";
import { encryptPassword } from "../../utils/passwordEncryptor";
import { ForbiddenException, NotFoundException } from "@nestjs/common";

@Injectable()
export class UsersService {
    constructor(private db: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
        const { password, email } = createUserDto;
        const existingUsser = await this.db.user.findUnique({
            where: { email },
        });
        if (existingUsser) {
            throw new ForbiddenException("This email already exists");
        }

        const encryptedPassword = await encryptPassword(password);

        const user = await this.db.user.create({
            data: {
                email: email,
                password: encryptedPassword,
            },
        });
        return user;
    }

    findAll() {
        return this.db.user.findMany();
    }

    async findOneById(id: string) {
        const user = await this.db.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException(`user not found - id ${id}`);
        }
        return user;
    }

    async findOneByEmail(email: string) {
        const user = await this.db.user.findUnique({ where: { email } });
        if (!user) {
            throw new NotFoundException(`user not found - email ${email}`);
        }
        return user;
    }

    async remove(id: string) {
        await this.findOneById(id);
        const user = await this.db.user.delete({
            where: { id },
        });
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        await this.findOneById(id);
        if (!updateUserDto) {
            throw new ForbiddenException("forbidden input");
        }
        if (updateUserDto.password) {
            updateUserDto.password = await encryptPassword(
                updateUserDto.password,
            );
        }
        const user = await this.db.user.update({
            where: {
                id,
            },
            data: updateUserDto,
        });
        return user;
    }
}
