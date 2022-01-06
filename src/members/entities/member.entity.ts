import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { Rent } from './../../rents/entities/rent.entity';

@Entity()
export class Member {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    firstName: string;
    @Column()
    lastName: string;
    @Column()
    birthDate: string;

    @OneToMany(() => Rent, rent => rent.member)
    rents: Rent[]
}