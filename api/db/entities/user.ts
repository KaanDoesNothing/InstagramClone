import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "npm:typeorm"
import { Post } from "./post.ts";
import { Story } from "./story.ts";
import { Follower } from "./follower.ts";
import { Like } from "./like.ts";
import { Comment } from "./comment.ts";
import { Bookmark } from "./bookmark.ts";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column({default: "https://archive.org/download/discordprofilepictures/discordblue.png"})
    avatar: string;
    
    @Column()
    username: string;

    @Column()
    email: string;
    
    @Column()
    password: string;
    
    @Column({default: "Hi"})
    description: string;

    @OneToMany(() => Post, (post) => post.author)
    posts: Relation<Post>[]

    @OneToMany(() => Story, (story) => story.author)
    stories: Relation<Story>[]

    @OneToMany(() => Follower, (follower) => follower.target)
    followers: Relation<Follower>[]

    @OneToMany(() => Follower, (follower) => follower.author)
    following: Relation<Follower>[]

    @OneToMany(() => Like, (like) => like.author)
    likes: Relation<Like>[]

    @OneToMany(() => Bookmark, (bookmark) => bookmark.author)
    bookmarks: Relation<Bookmark>[]

    @OneToMany(() => Comment, (comment) => comment.author)
    comments: Relation<Comment>[]

    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;
}