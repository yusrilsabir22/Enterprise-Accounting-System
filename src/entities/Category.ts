
import { Field, ObjectType, ID } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Product } from './Product';

@ObjectType()
@Entity()
export class Category extends BaseEntity {
    @Field(() => ID)
    @PrimaryColumn()
    id!: string;
    
    @Field()
    @Column()
    name: string;

    @Field(() => [Product], {nullable: true})
    @OneToMany(() => Product, (product) => product.category)
    product: Product[];

    @Field(() => String)
    @CreateDateColumn()
    created_at: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updated_at: Date;
}