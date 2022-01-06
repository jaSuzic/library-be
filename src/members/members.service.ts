import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RentsService } from './../rents/rents.service';
import { UpdateMemberDto } from './dto/update-member-dto';
import { CreateMemberDto } from './dto/create-member-dto';
import { Member } from './entities/member.entity';

@Injectable()
export class MembersService {
    constructor(
        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>,
        private readonly rentsService: RentsService
    ) { }

    async getMembers() {
        const members = await this.memberRepository.find();
        return { message: 'success', members, count: members.length };
    }

    async getMember(id: string) {
        const member = await this.memberRepository.findOne(id);
        if (!member) {
            throw new NotFoundException(`Member not found.`);
        }
        return member;
    }

    createMember(createMemberDto: CreateMemberDto) {
        const member = this.memberRepository.create(createMemberDto);
        return this.memberRepository.save(member);
    }

    async removeMember(id: string) {
        const member = await this.memberRepository.findOne(id);
        if (member) {
            await this.rentsService.removeRentByMember(id);
            this.memberRepository.remove(member);
        } else {
            return new NotFoundException();
        }
    }

    async updateMember(id: string, updateMemberDto: UpdateMemberDto) {
        const member = await this.memberRepository.preload({
            id: +id,
            ...updateMemberDto
        });

        if (!member) {
            throw new NotFoundException();
        }
        return this.memberRepository.save(member);
    }
}
