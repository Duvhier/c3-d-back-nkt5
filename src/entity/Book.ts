import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
// This entity represents a book in the database
@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    publishedDate: string;

    @Column()
    genre: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'text', nullable: true })
    coverUrl: string;
}