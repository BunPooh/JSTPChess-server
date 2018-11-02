import { IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pet {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @IsNotEmpty()
    @Column()
    public name: string;

    @IsNotEmpty()
    @Column()
    public age: number;

    public toString(): string {
        return `${this.name}`;
    }
}
