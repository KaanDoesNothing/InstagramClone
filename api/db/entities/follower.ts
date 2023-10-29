import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "npm:typeorm"
import { User } from "./user.ts";
import { Post } from "./post.ts";

@Entity()
export class Follower extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.following)
    author: Relation<User>;

    @ManyToOne(() => User, (user) => user.followers)
    target: Relation<User>;

    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;
}