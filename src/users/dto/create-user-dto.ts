import { IsOptional, isString, IsString } from "class-validator";

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
    image?: string
}
