import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsEmail, MinLength, IsString } from "class-validator"

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsString()
    @MinLength(8)
    password: string
}
