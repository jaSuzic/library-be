import { PaginationQueryDto } from './../common/dto/pagination-query.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { UsersService } from './users.service';
import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}


    // [TODO] this should be fixed/tested with FE part
    @Get('/getUsers')
    getUsersExceptLoggedOne(@Query() paginationQuery: PaginationQueryDto, @Headers() header: any) {
        console.log("Jaksa header: ", header)
        return this.usersService.findAllExceptLogged(paginationQuery);
    }

    @Get(':email')
    getUser(@Param('email') email: string) {
        return this.usersService.findOne(email);
    }

    @Post('/login') 
    login(@Body('email') email:string, @Body('password') pass: string) {
        return this.usersService.login(email, pass)
    }

    @Post('/register')
    createUser(@Body() body) {
        return this.usersService.createUser(body);
    }

    @Delete(':email')
    // @HttpCode(HttpStatus.GONE)
    deleteUser(@Param('email') email: string) {
        return this.usersService.remove(email);
    }

    @Post('/updatePass')
    updatePassword(@Body('email') email: string, @Body('password') password) {
        this.usersService.updatePassword(email, password) 
    }

    @Patch('/updateImage')
    updateImage(@Body() body) {
        throw new Error('not yet implemented')
    }

    @Patch('/updateUser') 
    updateUser(@Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(updateUserDto)
    }
}
