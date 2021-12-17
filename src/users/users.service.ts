import { UpdateUserDto } from './dto/update-user-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { PaginationQueryDto } from './../common/dto/pagination-query.dto';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  salt = +process.env.CRYPTO_SALT;

  findAllExceptLogged(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.userRepository.find({
      where: {email: Not('jaksas@gmail.com')},
      skip: offset ? offset : 0,
      take: limit ? limit : 10
    });
  }

  async findOne(email: string) {
    const user = await this.userRepository.findOne({email: email});
    if(!user) {
      throw new NotFoundException(`User with this e-mail was not found.`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const check = await this.userRepository.findOne({email: createUserDto.email});
    if(check){
      throw new HttpException('That email is already used', 400)
    }
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async update(updateUserDto: UpdateUserDto) {
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
    if(user) {
      this.userRepository.remove(user);
    }
  }

  async updatePassword(email: string, password: string) {
    const user = await this.userRepository.findOne({email: email});
    if(user) {
      user.password = await bcrypt.hash(password, this.salt)
      await this.userRepository.update(email, user);
      return await this.userRepository.findOne({email: email})
    }
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({email: email});
    if(!user) {
      throw new HttpException('Auth failed', 401);
    }
    return bcrypt.compare(password, user.password).then(valid => {
      if(!valid) {
        throw new HttpException('Auth failed', 401);
      }
      const userForSign = {...user};
      delete userForSign.password;
      const token = this.jwtService.sign({
        userForSign
      })
      return token;
    })
  }
}
