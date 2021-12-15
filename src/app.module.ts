import { Book } from './books/entities/book.entity';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { BooksController } from './books/books.controller';
import { BooksService } from './books/books.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Mona.Quantox.17',
      database: 'lib',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Book])
  ],
  controllers: [AppController, UsersController, BooksController],
  providers: [AppService, UsersService, BooksService],
})
export class AppModule {}
