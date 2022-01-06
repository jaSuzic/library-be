import { UploadImageAwsService } from '../images/images-aws.service';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UpdateUserDto } from './dto/update-user-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './../users/entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
        private imageService: UploadImageAwsService
    ) { }

    salt = +process.env.CRYPTO_SALT;

    findAllExceptLogged(email: string) {
        return this.userRepository.find({ where: { email: Not(email) } });
    }

    async findOne(email: string) {
        const user = await this.userRepository.findOne({ email: email });
        if (!user) {
            throw new NotFoundException(`User with this e-mail was not found.`);
        }
        return user;
    }

    async createUser(createUserDto: CreateUserDto, file: any) {
        const check = await this.userRepository.findOne({ email: createUserDto.email });
        if (check) {
            throw new HttpException('That email is already used', 400)
        }
        if (file) {
            const response = await this.imageService.upload(file)
            createUserDto.imagePath = response['Location'];

        }
        createUserDto.password = await bcrypt.hash(createUserDto.password, this.salt);

        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }

    async update(updateUserDto: UpdateUserDto, file: Express.Multer.File) {
        const user = await this.userRepository.preload({
            email: updateUserDto.email,
            ...updateUserDto,
        });
        if (!user) {
            throw new NotFoundException(`User not found.`);
        }

        return this.userRepository.save(user);
    }

    async remove(email: string) {
        const user = await this.findOne(email);
        if (user) {
            if (user.imagePath) {
                const imageName = user.imagePath.split('/').pop();
                await this.imageService.removeImage(imageName);
            }
            this.userRepository.remove(user);
        }
    }

    async updatePassword(email: string, newPassword: string, oldPassword: string) {
        const user = await this.userRepository.findOne({ email });
        if (user) {
            const oldPassCheck = await bcrypt.compare(oldPassword, user.password);
            if (!oldPassCheck) {
                return new HttpException('Incorrect old password', 400)
            }
            user.password = await bcrypt.hash(newPassword, this.salt)
            await this.userRepository.update(email, user);
            return { message: 'success' }
        }
    }

    async updateImage(email: string, file: Express.Multer.File) {
        const user = await this.userRepository.findOne({ email });
        if (!user) {
            throw new HttpException('User cannot be fetched', 404);
        }
        this.imageService.upload(file).then(async (res) => {
            if (user.imagePath) {
                const imageName = user.imagePath.split('/').pop();
                await this.imageService.removeImage(imageName);
            }
            user.imagePath = res['Location'];
            return this.userRepository.update({ email }, { imagePath: user.imagePath });
        }, (err) => {
            console.log("There was error with uploading image", err);
            throw new HttpException('Error occurred', 503);
        })
    }

    async login(email: string, password: string) {
        const user = await this.userRepository.findOne({ email });
        if (!user) {
            throw new HttpException('Auth failed', 401);
        }
        return bcrypt.compare(password, user.password).then(valid => {
            if (!valid) {
                throw new HttpException('Auth failed', 401);
            }
            const userForSign = { ...user };
            delete userForSign.password;
            const token = this.jwtService.sign({
                userForSign
            })
            return { token: token }
        })
    }
}
