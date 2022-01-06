import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { OrderingQueryDto } from './../common/dto/ordering-query.dto';
import { FilteringQueryDto } from './dto/filtering-query.dto';
import { PaginationQueryDto } from './../common/dto/pagination-query.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { BooksService } from './books.service';
@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Get()
    getBooks(
        @Query() paginationQuery: PaginationQueryDto,
        @Query() filteringQuery: FilteringQueryDto,
        @Query() orderingQuery: OrderingQueryDto
    ) {
        return this.booksService.getBooks(paginationQuery, filteringQuery, orderingQuery);
    }

    @Get(':id')
    getBook(@Param('id') id: string) {
        return this.booksService.findBook(id);
    }

    @UseInterceptors(FileInterceptor('image'))
    @Post()
    createBook(
        @Body() createBookDto: CreateBookDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.booksService.createBook(createBookDto, file);
    }

    @Delete(':id')
    removeBook(@Param('id') id: string) {
        return this.booksService.removeBook(id);
    }

    @UseInterceptors(FileInterceptor('image'))
    @Patch(':id')
    updateBook(
        @Param('id') id: string,
        @Body() updateBook: UpdateBookDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.booksService.updateBook(id, updateBook, file);
    }
}
