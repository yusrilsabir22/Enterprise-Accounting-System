
import { Field, ObjectType, ID } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Product } from './Product';

@ObjectType()
@Entity()
export class File extends BaseEntity {
    @Field(() => ID)
    @PrimaryColumn()
    id!: string;
    
    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    location: string;

    @Field(() => Product, {nullable: true})
    @ManyToOne(() => Product, (product) => product.files)
    product: Product;

    @Field(() => String)
    @CreateDateColumn()
    created_at: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updated_at: Date;
}