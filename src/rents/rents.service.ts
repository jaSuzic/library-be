import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateRentDto } from './dto/update-rent-dto';
import { CreateRentDto } from './dto/create-rent-dto';
import { Rent } from './entities/rent.entity';

@Injectable()
export class RentsService {
    constructor(
        @InjectRepository(Rent)
        private readonly rentRepository: Repository<Rent>
    ) { }

    async getRents() {
        const rents = await this.rentRepository.find({
            relations: ['book', 'member']
        });
        return {
            message: 'success', rents: rents, count: rents.length
        }
    }

    async getActiveRents() {
        const activeRents = await this.rentRepository.find({
            where: { returnDate: null },
            relations: ['book', 'member']
        });
        return {
            message: 'success', rents: activeRents, count: activeRents.length
        }
    }

    createRent(createRentDto: CreateRentDto) {
        const rent = this.rentRepository.create(createRentDto);
        return this.rentRepository.save(rent);
    }

    getRentHistory(id: string) {
        return this.rentRepository.find({
            where: { member: +id },
            relations: ['book', 'member']
        });
    }

    async returnBook(id: string, returnDate: Date) {
        const rent = await this.rentRepository.findOne(id, {
            relations: ['book', 'member']
        });
        rent.returnDate = returnDate;
        return this.rentRepository.save(rent);
    }

    async getRent(id: string) {
        const rent = await this.rentRepository.findOne(id, {
            relations: ['book', 'member']
        });
        if (!rent) {
            throw new NotFoundException();
        }
        return rent;
    }

    async removeRent(id: string) {
        const rent = await this.rentRepository.findOne(id, {
            relations: ['book', 'member']
        });
        return this.rentRepository.remove(rent);
    }

    async removeRentByMember(memberId: string) {
        await this.rentRepository.find({ where: { member: memberId } }).then((rents) => {
            return this.rentRepository.remove(rents)
        })
    }

    async removeRentByBook(bookId: string) {
        await this.rentRepository.find({ where: { book: bookId } }).then((rents) => {
            return this.rentRepository.remove(rents)
        })
    }

    async updateRent(id: string, updateRentDto: UpdateRentDto) {
        const rent = await this.rentRepository.preload({
            rentId: +id,
            ...updateRentDto
        });
        if (!rent) {
            throw new NotFoundException();
        }
        return this.rentRepository.save(rent);
    }
}
