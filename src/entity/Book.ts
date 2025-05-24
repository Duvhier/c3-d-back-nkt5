import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";

@Entity("books")
export class Book {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    publishedDate: string;

    @Column()
    genre: string;

    @Column({ type: 'text', nullable: true })
    coverUrl: string;
}