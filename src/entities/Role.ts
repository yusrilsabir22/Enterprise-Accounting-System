
import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from './User';

@ObjectType()
@Entity()
export class Role extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Field(() => String, {nullable: true})
    @Column()
    title: string;

    @Field(() => [User], {nullable: true})
    @OneToMany(() => User, (user) => user.roles)
    users: User[];

    @Field(() => String)
    @CreateDateColumn()
    created_at: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updated_at: Date;
}