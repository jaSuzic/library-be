import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put
} from '@nestjs/common';

import { UpdateRentDto } from './dto/update-rent-dto';
import { CreateRentDto } from './dto/create-rent-dto';
import { RentsService } from './rents.service';

@Controller('rents')
export class RentsController {
    constructor(private readonly rentsService: RentsService) { }

    @Get()
    getRents() {
        return this.rentsService.getRents();
    }

    @Get('/active')
    getActiveRents() {
        return this.rentsService.getActiveRents();
    }

    @Post()
    createRent(@Body() createRentDto: CreateRentDto) {
        return this.rentsService.createRent(createRentDto);
    }

    @Post('/history')
    getRentHistory(@Body('memberId') id: string) {
        return this.rentsService.getRentHistory(id);
    }

    @Patch('/returnBook')
    returnBook(@Body('id') id: string, @Body('returnDate') returnDate: Date) {
        return this.rentsService.returnBook(id, returnDate);
    }

    @Get(':id')
    getRent(@Param('id') id: string) {
        return this.rentsService.getRent(id);
    }

    @Delete(':id')
    removeRent(@Param('id') id: string) {
        return this.rentsService.removeRent(id);
    }

    @Put(':id')
    updateRent(@Param('id') id: string, @Body() updateRentDto: UpdateRentDto) {
        return this.rentsService.updateRent(id, updateRentDto);
    }
}
