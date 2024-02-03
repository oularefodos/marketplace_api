import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
} from "@nestjs/swagger";
import { UserType } from "./entities/user.entity";

@ApiTags("Users")
@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiCreatedResponse({ type: UserType })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @ApiOkResponse({ type: UserType, isArray: true })
    findAll() {
        return this.usersService.findAll();
    }

    @Get(":id")
    @ApiOkResponse({ type: UserType })
    findOne(@Param("id") id: string) {
        return this.usersService.findOneById(id);
    }

    @Patch(":id")
    @ApiOkResponse({ type: UserType })
    update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(":id")
    @ApiOkResponse({ type: UserType })
    remove(@Param("id") id: string) {
        return this.usersService.remove(id);
    }
}
