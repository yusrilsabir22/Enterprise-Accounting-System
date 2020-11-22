import { Category } from './Category';

import { Field, ObjectType, ID } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { ProductOrder } from './ProductOrder';
import { Order } from './Order';
import { File } from './File';

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

    @Field(() => [ProductOrder])
    @OneToMany(() => ProductOrder, (productOrder) => productOrder.product, {cascade: true})
    productOrders: ProductOrder[];

    @Field(() => [File])
    @OneToMany(() => File, (file) => file.product)
    files: File[];

    @Field()
    @Column({type: 'int',nullable: true, default: 0})
    price!: number;

    @Field(() => [Order])
    @OneToMany(() => Order, (order) => order.products)
    orders: Order[]

    @Field(() => String)
    @CreateDateColumn()
    created_at: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updated_at: Date;
}