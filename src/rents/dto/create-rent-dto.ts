import { IsDate, IsNumber, IsOptional } from "class-validator";

export class CreateRentDto {

    @IsNumber()
    member: number;

    @IsNumber()
    book: number;

    @IsDate()
    rentDate: Date;

    @IsDate()
    @IsOptional()
    returnDate: Date;
}
