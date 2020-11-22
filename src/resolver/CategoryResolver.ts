import 'reflect-metadata';
import { Category } from './../entities/Category';
import { FieldError } from './../types';
import { Arg, Authorized, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
// import { getConnection } from 'typeorm';

@ObjectType()
class CategoryResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Category, { nullable: true })
  category?: Category;
}


@Resolver(Category)
export class CategoryResolver {
    @Authorized(['owner', 'admin warehouse'])
    @Query(() => [Category])
    async getCategories() {
        let results = await Category.find({relations: ['product'], where: {}})
        return results
    }

    @Authorized(['owner', 'admin warehouse'])
    @Mutation(() => CategoryResponse)
    async insertNewCategory(
        @Arg("name") name: string,
    ): Promise<CategoryResponse> {
        let category;
        
        try {
            const idCount = (await Category.find({})).length

            const id = 'ca-00'+ idCount
           
            const objUser = new Category()
            objUser.id = id
            objUser.name = name
            const results = await Category.save(objUser)
            category = results
        } catch (error) {
            return error
        }

        return { category }
    }
}