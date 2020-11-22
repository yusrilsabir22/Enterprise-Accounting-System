import { ProductOrder } from './ProductOrder';
import {Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, PrimaryColumn, BeforeInsert, OneToMany} from "typeorm";
import {Field, ID, ObjectType} from 'type-graphql'
import {v4} from 'uuid'
import { User } from './User';
import { Customers } from './Customers';
import { Product } from './Product';
@ObjectType()
@Entity()
export class Order extends BaseEntity{

    @Field(() => ID,{nullable: true})
    @PrimaryColumn()
    id!: string;

    @Field(() => [ProductOrder])
    @OneToMany(() => ProductOrder, (productOrder) => productOrder.order, {cascade: true})
    productOrders: ProductOrder[];

    @Field(() => User)
    @ManyToOne(() => User, (user) => user)
    employee: User

    @Field(() => Customers)
    @ManyToOne(() => Customers, customer => customer.orders)
    customersOrder: Customers
    
    @Field()
    @Column({type: 'int', default: 0})
    cost: number;

    @Field(() => [Product])
    @OneToMany(() => Product, (product) => product.orders)
    products: Product[]

    @Field(() => String)
    @CreateDateColumn()
    created_at: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updated_at: Date;

    @BeforeInsert()
    setId() {
        this.id = v4().replace(/-/g, '')
    }
}
