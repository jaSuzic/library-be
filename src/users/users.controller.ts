import { UsersService } from './users.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put } from '@nestjs/common';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Get('/login') 
    login() {
        return 'Something'
    }

    @Post('/register')
    createUser(@Body() body) {
        return this.usersService.create(body);
    }

    @Delete(':id')
    // @HttpCode(HttpStatus.GONE)
    deleteUser(@Param('email') email: string) {
        return this.usersService.remove(email )
    }

    @Post('/updatePass')
    updatePassword() {

    }

    @Patch('/updateImage')
    updateImage(@Body() body) {
        return `Received this: ${body}.`
    }

    @Post('/getUsers') 
    getUsersExcept() {

    }

    @Put('/updateUser') 
    updateUser() {

    }
}
