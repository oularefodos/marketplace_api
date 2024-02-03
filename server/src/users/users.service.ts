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
            throw new ForbiddenException('This email already exists');
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

    async findOneByEmail(email : string) {
        const user = await this.db.user.findUnique({ where: { email } });
        if (!user) {
            throw new NotFoundException(`user not found - id ${email}`);
        }
        return user;
    }

    remove(id: string) {
        return `This action removes a #${id} user`;
    }

    update(id: string, updateUserDto: UpdateUserDto) {
        return ''
    }

}
