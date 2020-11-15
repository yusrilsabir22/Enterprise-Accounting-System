import 'reflect-metadata';
import { Category } from './../entities/Category';
import { Product } from './../entities/Product';
import { FieldError } from './../types';
import { Arg, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";



@ObjectType()
class ProductResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Product, { nullable: true })
  product?: Product;
}

@Resolver(Product)
export class ProductResolver {
    @Query(() => [Product])
    async getProducts() {
        let results = await Product.find({relations: ['category'], where: {}})
        return results
    }

    @Mutation(() => ProductResponse)
    async insertNewProduct(
        @Arg("name") name: string,
        @Arg("categoryID") cat_id: string
    ): Promise<ProductResponse> {
        let product;
       try {
            const idCount = (await Product.find({})).length

            const id = cat_id + '-'+ idCount
            const cat = await Category.find({where: {id: cat_id}})
            if(!cat) {
                return {
                    errors: [
                        {
                            field: 'Category not found',
                            message: 'invalid categoryID, please try again.'
                        }
                    ]
                }
            }
            const objCategory = new Product()
            objCategory.id = id
            objCategory.category = cat[0]
            objCategory.name = name
            const results = await Product.save(objCategory)

            product = results
        } catch (error) {
            return error
        }
        
        return { product }
    }
}