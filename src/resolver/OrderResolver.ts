import 'reflect-metadata';
import { ProductOrder } from '../entities/ProductOrder';
import { MyContext } from '../types';
import { Customers } from '../entities/Customers';
import { FieldError } from '../types';
import { Arg, Authorized, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { Order } from '../entities/Order';
import { User } from '../entities/User';
import { getConnection } from 'typeorm';

@ObjectType()
class OrderResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Order, { nullable: true })
  order?: Order;
}

@InputType()
@ObjectType()
class InsertProduct {
    @Field(() => String)
    productId: string;

    @Field()
    count: number
}



@InputType()
class InsertOrder {
    @Field({nullable: true})
    customer_id?: string;

    @Field()
    handphone?: string;

    @Field()
    name?: string;

    @Field()
    email?: string;

    @Field(() => [InsertProduct])
    products: InsertProduct[];
}

@Resolver(Order)
export class OrderResolver {
    @Authorized(['owner', 'cashier'])
    @Query(() => [Order])
    async getOrders(@Arg("id", () => String) id: string) {
        let results = await Order.find({relations: ['productOrders', 'customersOrder', 'employee'], where: {id}})
        return results
    }

    @Authorized(['owner', 'cashier'])
    @Mutation(() => OrderResponse)
    async insertNewOrder(
        @Arg("options") options: InsertOrder,
        @Ctx() {req}: MyContext
    ): Promise<OrderResponse> {
        let order;
        let cust: Customers; // customer
        try {
            const employee = await User.find({id: req.session.userId})
            if(options.customer_id) {
                const customer = await Customers.find({where: options.customer_id})
                cust = customer[0]
            } else {
                const objCustomer = new Customers()
                objCustomer.name = options.name || 'test'
                objCustomer.handphone = options.handphone || 'xxx-xxx-xxx-xxx'
                objCustomer.email = options.email || 'xxx@xxx.com'
                const customer = await Customers.save(objCustomer)
                cust = customer
            }   

            const objOrder = new Order()
            objOrder.employee = employee[0]
            objOrder.customersOrder = cust
            let orders = await Order.save(objOrder)
            let total = 0
            const prodOrd: ProductOrder[]= []
            options.products.map(async (v) => {
                // let product = await Product.findOne({where: v.productId})
                console.log(v.productId)
                let tot = 1//v.count * product!.price
                let o: Partial<ProductOrder> = {
                    ...v,
                    orderId: orders.id,
                    price: tot,
                    created_at: new Date(),
                    updated_at: new Date()
                }
                // @ts-ignore
                prodOrd.push(o)
            });
            
            const objProductOrder = await ProductOrder.save(prodOrd)
            objProductOrder.map((v) => {
                total = total + v.count * v.price
            })
            // await Order.update(orders,{cost: total})
            await getConnection()
            .createQueryBuilder()
            .update(Order)
            .set({
                cost: total
            })
            .where("id = :id", {id: orders.id})
            .execute()
            
            // const results = objProductOrder
            // console.log(results)
            order = await Order.find({relations: ['productOrder', 'customersOrder', 'employee'], where: {id: orders.id}})
            console.log(order[0])
        } catch (error) {
            // await Customers.delete(cust)
            // await Order.delete(order)
            return error
        }
        
        return { order: order[0] }
    }
}