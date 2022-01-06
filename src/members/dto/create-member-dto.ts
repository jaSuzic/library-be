import { IsString } from "class-validator";


export class CreateMemberDto {
    @IsString()
    readonly firstName: string;
    @IsString()
    readonly lastName: string;
    @IsString()
    readonly birthDate: string;
}

