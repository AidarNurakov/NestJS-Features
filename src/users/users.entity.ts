import { Exclude } from "class-transformer";
import File from "src/files/file.entity";
import PrivateFile from "src/files/privateFiles.entity";
import Post from "src/posts/post.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Address from "./address.entity";

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true })
    public email: string;

    @Column()
    public name: string;

    @Column()
    @Exclude()
    public password: string;

    @OneToOne(() => Address, {
        eager: true,
        cascade: true
    })
    @JoinColumn()
    public address: Address;

    @OneToMany(() => Post, (post: Post) => post.author)
    public posts: Post[]

    @JoinColumn()
    @OneToOne(() => File, {
        eager: true,
        nullable: true
    })
    public avatar?: File;

    @OneToMany(() => PrivateFile, (file: PrivateFile) => file.owner)
    public files: PrivateFile[];
}