import { ApiProperty } from "@nestjs/swagger";

export class UserType {
    @ApiProperty()
    id : string;

    @ApiProperty()
    email : string

    @ApiProperty()
    role : string
}
