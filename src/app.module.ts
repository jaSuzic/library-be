import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { CheckAuthMiddleware } from './common/check-auth.middleware';
import { Rent } from './rents/entities/rent.entity';
import { Book } from './books/entities/book.entity';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { BooksController } from './books/books.controller';
import { BooksService } from './books/books.service';
import { User } from './users/entities/user.entity';
import { MembersController } from './members/members.controller';
import { RentsController } from './rents/rents.controller';
import { RentsService } from './rents/rents.service';
import { MembersService } from './members/members.service';
import { Member } from './members/entities/member.entity';
import { UploadImageAwsService } from './images/images-aws.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: + process.env.DATABASE_PORT,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            autoLoadEntities: true,
        }),
        TypeOrmModule.forFeature([Book, User, Member, Rent]),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: '8h' }
        })
    ],
    controllers: [UsersController, BooksController, MembersController, RentsController],
    providers: [UsersService, BooksService, RentsService, MembersService, UploadImageAwsService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CheckAuthMiddleware)
            .exclude({ path: 'users/login', method: RequestMethod.POST })
            .forRoutes({ path: '*', method: RequestMethod.ALL })
    }
}
