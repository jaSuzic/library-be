import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UsersService {
    private users: User[] = [
        {
            email: 'jaksas@gmail.com',
            password: 'test',
            firstName: 'Jaksa',
            lastName: 'Suzic',
            position: 'admin'
        }
    ];

    findAll() {
        return this.users;
    }

    findOne(email: string) {
        return this.users.find((user)=>user.email === email);
    }

    create(createUserDto: any) {
        this.users.push(createUserDto);
    }

    update(updateUserDto: any) {
        const existingUser = this.findOne(updateUserDto.email);
        if(existingUser) {
            // update existing user
        }
    }

    remove(email: string) {
        const userIndex = this.users.findIndex(user=>user.email === email);
        if(userIndex>=0) {
            this.users.splice(userIndex, 1);
        }
    }

}
