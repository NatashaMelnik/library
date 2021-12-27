import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  author!: string;

  @Column()
  type!: string;

  @Column()
  description!: string;

  @Column()
  pages!: string;

  @Column()
  rating!: string;

  @Column()
  link!: string;

  @Column()
  image!: string;
}
