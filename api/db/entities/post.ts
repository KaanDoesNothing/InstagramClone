import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "npm:typeorm"
import { User } from "./user.ts";
import { Comment } from "./comment.ts";
import { Like } from "./like.ts";


@Entity()
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.posts)
    author: Relation<User>;

    @Column()
    source: string;

    @Column()
    description: string;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Relation<Comment>[]

    @OneToMany(() => Like, (like) => like.post)
    likes: Relation<Like>[]

    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;
}