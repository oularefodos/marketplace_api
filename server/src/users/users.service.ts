import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(private db: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.db.user.create({data : createUserDto}); 
  }

  findAll() {
    return this.db.user.findMany()
  }

  findOne(id: string) {
    return this.db.user.findUnique({where : {id}})
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
