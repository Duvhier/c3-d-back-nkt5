<<<<<<< HEAD
import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";

@Entity("books")
=======
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
// This entity represents a book in the database
@Entity()
>>>>>>> decb571e4618b03179d43eef343fde0f81909f75
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