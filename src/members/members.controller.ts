import { Controller, Delete, Get, Param, Patch, Post, Body, Put } from '@nestjs/common';

import { UpdateMemberDto } from './dto/update-member-dto';
import { CreateMemberDto } from './dto/create-member-dto';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
    constructor(private readonly membersService: MembersService) { }

    @Get()
    getMembers() {
        return this.membersService.getMembers();
    }

    @Get(':id')
    getMember(@Param('id') id: string) {
        return this.membersService.getMember(id);
    }

    @Post()
    createMember(@Body() createMemberDto: CreateMemberDto) {
        return this.membersService.createMember(createMemberDto);
    }

    @Delete(':id')
    removeMember(@Param('id') id: string) {
        return this.membersService.removeMember(id);
    }

    @Patch(':id')
    updateMember(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
        return this.membersService.updateMember(id, updateMemberDto);
    }
}
