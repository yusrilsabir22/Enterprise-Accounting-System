import { Category } from './Category';

import { Field, ObjectType, ID } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
    @Field(() => ID)
    @PrimaryColumn()
    id!: string;
    
    @Field()
    @Column()
    name: string;

    @Field(() => Category, {nullable: true})
    @ManyToOne(() => Category, (category) => category.product)
    category: Category;

    @Field(() => String)
    @CreateDateColumn()
    created_at: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updated_at: Date;
}