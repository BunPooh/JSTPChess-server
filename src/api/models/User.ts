import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @IsNotEmpty()
    @Column({ name: "first_name" })
    public firstName: string;

    @IsNotEmpty()
    @Column({ name: "last_name" })
    public lastName: string;

    @IsNotEmpty()
    @Column()
    public email: string;

    public toString(): string {
        return `${this.firstName} ${this.lastName} (${this.email})`;
    }
}
