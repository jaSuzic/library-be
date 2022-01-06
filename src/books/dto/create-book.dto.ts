import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";


export class CreateBookDto {
    @IsString()
    title: string;

    @IsString()
    author: string;

    @IsNumber()
    @IsPositive()
    year: number;

    @IsString()
    @IsOptional()
    imagePath?: string
}
