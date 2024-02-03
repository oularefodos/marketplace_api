import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export class UserType {
    @ApiProperty()
    id : string;

    @ApiProperty()
    email : string

    @ApiProperty()
    role : UserRole

    @Exclude()
    password : string
}

export enum UserRole {
    ADMIN,
    SUPER_ADMIN,
    USER
}
