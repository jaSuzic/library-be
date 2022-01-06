import { UploadImageAwsService } from '../images/images-aws.service';
import { Injectable, NotFoundException, UploadedFile, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { OrderingQueryDto } from './../common/dto/ordering-query.dto';
import { FilteringQueryDto } from './dto/filtering-query.dto';
import { PaginationQueryDto } from './../common/dto/pagination-query.dto';
import { RentsService } from './../rents/rents.service';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
        private readonly rentService: RentsService,
        private imageService: UploadImageAwsService
    ) { }

    async getBooks(
        paginationQueryDto: PaginationQueryDto,
        filteringQuery: FilteringQueryDto,
        orderingQuery: OrderingQueryDto
    ) {
        const { offset, limit } = paginationQueryDto;
        const { title, author } = filteringQuery;
        const { sortItem, order } = orderingQuery;
        const query = {
            skip: offset ?? 0,
            take: limit ?? 10
        };
        if (title || author) {
            if (title && author) {
                query['where'] = { title: Like('%' + title + '%'), author: Like('%' + author + '%') };
            } else if (title) {
                query['where'] = { title: Like('%' + title + '%') };
            } else if (author) {
                query['where'] = { author: Like('%' + author + '%') };
            }
        }
        const orderKey = sortItem ?? 'title';
        const orderValue = order ?? 'ASC';
        const orderObj = {};
        orderObj[orderKey] = orderValue;
        query['order'] = orderObj;

        const [books, total] = await this.bookRepository.findAndCount(query);
        return { message: 'success', books, count: total };
    }

    async findBook(id: string) {
        const book = await this.bookRepository.findOne(id);

        if (!book) {
            throw new NotFoundException(`Book with id: ${id} not found.`);
        }
        return book;
    }

    async createBook(createBookDto: CreateBookDto, file: Express.Multer.File) {
        const book = this.bookRepository.create(createBookDto);
        if (file) {
            await this.imageService.upload(file).then((res) => {
                book.imagePath = res['Location'];
            }, (err) => {
                console.log("There was error with creating new book", err);
                throw new HttpException('Error occurred', 503);
            });
            return this.bookRepository.save(book);
        }
    }

    async removeBook(id: string) {
        const book = await this.findBook(id);
        if (book) {
            if (book.imagePath) {
                const imageName = book.imagePath.split('/').pop();
                await this.imageService.removeImage(imageName);
            }
            await this.rentService.removeRentByBook(id);
            return this.bookRepository.remove(book);
        } else {
            return new NotFoundException();
        }
    }

    async updateBook(id: string, updateBookDto: UpdateBookDto, file: Express.Multer.File) {
        const book = await this.bookRepository.preload({
            id: +id,
            ...updateBookDto
        });
        if (file) {
            return this.imageService.upload(file).then((res) => {
                book.imagePath = res['Location'];
                return this.bookRepository.save(book);
            }, (err) => {
                console.log("There was error with creating new user", err);
                throw new HttpException('Error occurred', 503);
            })
        }
        if (!book) {
            throw new NotFoundException(`Book with id: ${id} not found.`);
        }
        return this.bookRepository.save(book);
    }
}
