import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Book } from './../../books/entities/book.entity';
import { Member } from './../../members/entities/member.entity';

@Entity()
export class Rent {
    @PrimaryGeneratedColumn()
    rentId: number;

    @JoinColumn()
    @ManyToOne(() => Member, (member) => member.id)
    member: number;

    @JoinColumn()
    @ManyToOne(() => Book, (book) => book.id)
    book: number;

    @Column()
    rentDate: Date;

    @Column({ nullable: true })
    returnDate: Date;
}
