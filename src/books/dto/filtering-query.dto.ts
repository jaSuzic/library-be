import { IsOptional, IsString } from "class-validator";

export class FilteringQueryDto {

    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    author: string;
}
