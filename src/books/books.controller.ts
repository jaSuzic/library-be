import { PaginationQueryDto } from './../common/dto/pagination-query.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { BooksService } from './books.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

@Controller('books')
export class BooksController {

    constructor(private readonly booksService: BooksService) {}

    /*
        //PAGINACIJA: 

        @Get()
        findAll(@Query() paginationQuery) {
            const { limit, offset } = paginationQuery;
            return 'Something'
        }
    */
    
    @Get()
    getBooks(@Query() paginationQuery: PaginationQueryDto) {
        return this.booksService.getBooks(paginationQuery);
    }

    @Get(':id') 
    getBook(@Param('id') id: string) {
        return this.booksService.findBook(id);
    }

    @Post()
    createBook(@Body() createBookDto: CreateBookDto) {
        return this.booksService.createBook(createBookDto);
    }

    @Delete(':id')
    removeBook(@Param('id') id: string) {
        return this.booksService.removeBook(id);
    }

    @Patch(':id') 
    updateBook(@Param('id') id: string, @Body() updateBook: UpdateBookDto) {
        return this.booksService.updateBook(id, updateBook);
    }
}
