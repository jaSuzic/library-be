import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Rent } from './../../rents/entities/rent.entity';
@Entity()
export class Book {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column()
    author: string;
    @Column()
    year: number;
    @Column({ nullable: true })
    imagePath?: string

    @OneToMany(() => Rent, rent => rent.book)
    rents: Rent[]
}