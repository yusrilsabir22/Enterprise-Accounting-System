import { Order } from './Order';
import {Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import {Field, ObjectType} from 'type-graphql'

@ObjectType()
@Entity()
export class Customers extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;
 
    @Field({nullable: false})
    @Column({type: 'varchar'})
    name: string;

    @Field()
    @Column({ unique: true })
    handphone: string;

    @Field()
    @Column({ unique: true })
    email!: string;
    
    @Field(() => [Order])
    @OneToMany(() => Order, (order) => order.customersOrder)
    orders: Order[]

    @Field(() => String)
    @CreateDateColumn()
    created_at: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updated_at: Date;
}
