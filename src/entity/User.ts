import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Book } from "./Book";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  name!: string;

  @Column()
  passwordHash!: string;

  @Column({ nullable: true })
  readed!: string;

  @Column({ nullable: true })
  liked!: string;

  @Column({ nullable: true })
  img!: string;

  @Column({ nullable: true })
  recomended!: string;

  @OneToMany(() => Book, (book) => book.id)
  book!: Book[];
}
