import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationQueryDto {

    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    limit: number;

    @Min(0)
    @IsOptional()
    @Type(() => Number)
    offset: number;
}
