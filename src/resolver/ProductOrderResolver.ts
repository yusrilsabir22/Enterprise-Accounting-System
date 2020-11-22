import 'reflect-metadata';
import { ProductOrder } from '../entities/ProductOrder';
import { Arg, Authorized, Query, Resolver } from "type-graphql";

@Resolver(ProductOrder)
export class ProductOrderResolver {
    @Authorized(['owner', 'cashier'])
    @Query(() => [ProductOrder])
    async getProductOrder(@Arg("id", () => String) id: string) {
        let results = await ProductOrder.find({relations: ['product', 'order'], where: {orderId: id}})
        return results
    }

    @Authorized(['owner', 'cashier'])
    @Query(() => [ProductOrder])
    async getProductOrders() {
        let results = await ProductOrder.find({relations: ['product', 'order'], where: {}})
        return results
    }
}