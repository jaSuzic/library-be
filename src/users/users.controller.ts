import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Post('/getUsers')
    getUsersExceptLoggedOne(@Body('email') email: string) {
        return this.usersService.findAllExceptLogged(email);
    }

    @Get(':email')
    getUser(@Param('email') email: string) {
        return this.usersService.findOne(email);
    }

    @Post('/login')
    login(@Body('email') email: string, @Body('password') pass: string) {
        return this.usersService.login(email, pass)
    }

    @UseInterceptors(FileInterceptor('image'))
    @Post('/register')
    createUser(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
        const data: CreateUserDto = {
            email: body.email,
            password: body.password,
            firstName: body.firstName,
            lastName: body.lastName,
            position: body.position
        }
        return this.usersService.createUser(data, file);
    }

    @Delete(':email')
    // @HttpCode(HttpStatus.GONE)
    deleteUser(@Param('email') email: string) {
        return this.usersService.remove(email);
    }

    @Post('/updatePass')
    updatePassword(@Body('email') email: string, @Body('newPass') newPassword, @Body('oldPass') oldPassword) {
        return this.usersService.updatePassword(email, newPassword, oldPassword)
    }

    @UseInterceptors(FileInterceptor('image'))
    @Patch('/updateImage')
    updateImage(@Body('email') email: string, @UploadedFile() file: Express.Multer.File) {
        return this.usersService.updateImage(email, file);
    }

    @UseInterceptors(FileInterceptor('image'))
    @Patch('/updateUser')
    updateUser(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
        const data: UpdateUserDto = {
            email: body.email,
            firstName: body.firstName,
            lastName: body.lastName,
            position: body.position
        }
        return this.usersService.update(data, file)
    }
}
