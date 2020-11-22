import { Product } from './Product';
import { Order } from './Order';
import { Field, ObjectType, ID } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class ProductOrder extends BaseEntity {
    @Field(() => ID)
    @PrimaryColumn()
    productId!: string;

    @Field(() => ID)
    @PrimaryColumn()
    orderId!: string;
    
    @Field()
    @Column()
    count: number;

    @Field()
    @Column()
    price: number;

    @Field(() => Order)
    @ManyToOne(() => Order, order => order.productOrders, {primary: true})
    order: Order

    @Field(() => Product)
    @ManyToOne(() => Product, product => product.productOrders, {primary: true})
    product: Product

    @Field(() => String)
    @CreateDateColumn()
    created_at!: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updated_at!: Date;
}