import { PaginationQueryDto } from './../common/dto/pagination-query.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from './entities/book.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}

  getBooks(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.bookRepository.find({
      skip: offset ? offset : 0,
      take: limit ? limit : 10,
    });
  }

  async findBook(id: string) {
    const book = await this.bookRepository.findOne(id);

    if (!book) {
      throw new NotFoundException(`Book with id: ${id} not found.`);
    }
    return book;
  }

  createBook(createBookDto: CreateBookDto) {
    const book = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(book);
  }

  async removeBook(id: string) {
    const book = await this.findBook(id);
    if (book) {
      this.bookRepository.remove(book);
    }
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.preload({
      id: +id,
      ...updateBookDto,
    });
    if (!book) {
      throw new NotFoundException(`Book with id: ${id} not found.`);
    }

    return this.bookRepository.save(book);
  }
}
