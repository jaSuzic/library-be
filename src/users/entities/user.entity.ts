import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryColumn()
    @Index()
    email: string;
    @Column()
    password: string;
    @Column()
    firstName: string;
    @Column()
    lastName: string;
    @Column()
    position: string;

    @Column({ nullable: true })
    imagePath?: string
}