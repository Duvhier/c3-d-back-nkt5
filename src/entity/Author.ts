import { Entity, ObjectIdColumn, Column, ObjectId } from "typeorm";

@Entity()
export class Author {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    name: string;

    @Column({ nullable: true })
    nationality?: string;

    @Column({ nullable: true })
    coverUrl?: string;
} 