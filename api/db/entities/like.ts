import { Entity, ManyToOne, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, BaseEntity } from "npm:typeorm";
import { User } from "./user.ts";
import { Post } from "./post.ts";

@Entity()
export class Like extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.likes)
    author: Relation<User>;

    @ManyToOne(() => Post, (post) => post.likes)
    post: Relation<Post>;

    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;
}