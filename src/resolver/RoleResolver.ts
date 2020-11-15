import 'reflect-metadata';
import { Role } from './../entities/Role';
import { MyContext, FieldError } from './../types';
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { getConnection } from 'typeorm';



@ObjectType()
class RoleResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Role, { nullable: true })
  role?: Role;
}

@Resolver(Role)
export class RoleResolver {
    @Query(() => [Role])
    async getRoles(@Ctx() {req}: MyContext) {
        console.log(req.session)
        let results = await Role.find({relations: ['users'], where: {}})
        console.log(results)
        return results
    }

    @Mutation(() => RoleResponse)
    async insertNewRole(
        @Arg("title") title: string
    ): Promise<RoleResponse> {
        let role;
        try {
            const results = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Role)
            .values({title})
            .returning("*")
            .execute();

            role = results.raw[0]
        } catch (error) {
            return error
        }

        // req.session.userId = user.id;
        return { role }
    }
}