import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "../prisma/prisma.service";
import { encryptPassword } from "../../utils/passwordEncryptor";
import { ForbiddenException } from "@nestjs/common";

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

    findOneById(id: string) {
        return this.db.user.findUnique({ where: { id } });
    }

    findOneByEmail(email : string) {
        return this.db.user.findUnique({ where: { email } });
    }

    update(id: string, updateUserDto: UpdateUserDto) {
        return ''
    }

    remove(id: string) {
        return `This action removes a #${id} user`;
    }
}
