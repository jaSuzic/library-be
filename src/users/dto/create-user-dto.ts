import { IsOptional, IsString } from "class-validator";
export class CreateUserDto {

    @IsString()
    email: string;
    @IsString()
    password: string;
    @IsString()
    firstName: string;
    @IsString()
    lastName: string;
    @IsString()
    position: string;

    @IsString()
    @IsOptional()
    imagePath?: string
}
