import { Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
// @Unique(['email'])
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
    
    @Column({nullable: true})
    image?: string
}