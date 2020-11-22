import { Order } from './Order';
import { Role } from './Role';
import {Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, PrimaryColumn, OneToMany} from "typeorm";
import {Field, ID, ObjectType} from 'type-graphql'

@ObjectType()
@Entity()
export class User extends BaseEntity{

    @Field(() => ID,{nullable: true})
    @PrimaryColumn()
    id!: number;
 
    @Field({nullable: false})
    @Column({type: 'varchar'})
    firstName!: string;

    @Field({nullable: false})
    @Column({type: 'varchar'})
    lastName!: string;

    @Field(() => Number)
    @Column()
    age!: number;

    @Field(() => Role)
    @ManyToOne(() => Role, (role) => role.users, {cascade: true})
    roles: Role;

    @Field(() => [Order])
    @OneToMany(() => Order, (order) => order.employee)
    order: Order[]

    @Field()
    @Column({ unique: true })
    username!: string;

    @Field()
    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Field(() => String)
    @CreateDateColumn()
    created_at: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updated_at: Date;
}
