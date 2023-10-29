import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "npm:typeorm"
import { User } from "./user.ts";
import { Post } from "./post.ts";

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.comments)
    author: Relation<User>;

    @Column()
    content: string;

    @ManyToOne(() => Post, (post) => post.comments)
    post: Relation<Post>

    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;
}