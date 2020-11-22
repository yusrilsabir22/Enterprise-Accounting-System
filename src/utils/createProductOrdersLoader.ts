import DataLoader from "dataloader"
import { ProductOrder } from "../entities/ProductOrder"

export const createProductOrdersLoader = () => {
    new DataLoader<{productId: string, orderId: string}, ProductOrder | null>(
        async (keys) => {
            const products = await ProductOrder.findByIds(keys as any);
            const productIdToProduct: Record<string, ProductOrder> = {}
            products.forEach((product) => {
                productIdToProduct[`${product.productId}|${product.orderId}`] = product
            })
            return keys.map(
                (key) => productIdToProduct[`${key.productId}|${key.orderId}`]
            )
        }
    ) 
}