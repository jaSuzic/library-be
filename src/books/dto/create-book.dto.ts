import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";


export class CreateBookDto {
    @IsString()
    readonly title: string;
    
    @IsString()
    readonly author: string;
    
    @IsNumber()
    @IsPositive()
    readonly year: number;
    
    @IsString()
    @IsOptional()
    readonly image?: string
}
