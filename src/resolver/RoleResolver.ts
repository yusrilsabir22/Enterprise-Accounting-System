import 'reflect-metadata';
import { Role } from './../entities/Role';
import { FieldError } from './../types';
import { Arg, Authorized, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { getConnection } from 'typeorm';

@ObjectType()
class RoleResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Role, { nullable: true })
  role?: Role[];
}

@Resolver(Role)
export class RoleResolver {
    @Authorized(['owner'])
    @Query(() => [Role])
    async getRoles() {
        let results = await Role.find({relations: ['users'], where: {}})
        return results
    }

    // @Authorized(['owner'])
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