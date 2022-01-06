import { IsOptional, IsString } from "class-validator";

export class OrderingQueryDto {

    @IsOptional()
    @IsString()
    sortItem: string;

    @IsOptional()
    @IsString()
    order: string;
}
