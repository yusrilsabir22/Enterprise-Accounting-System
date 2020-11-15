import { Role } from './../entities/Role';
import 'reflect-metadata';
import { MyContext, FieldError } from './../types';
import { User } from '../entities/User';
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
// import { getConnection } from 'typeorm';


@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@InputType()
class UserRegister {
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    age: number;

    @Field()
    rolesId: number;
}

@Resolver(User)
export class UserResolver {
    @Query(() => [User])
    async getUsers(@Ctx() {req}: MyContext) {
        console.log(req.session)
        let results = await User.find({relations: ['roles'], where: {}})
        console.log(results)
        return results
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UserRegister,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        let user;
        
        try {
            const idCount = (await User.find({})).length

            const id = options.rolesId * 1000 + idCount
            const role = await Role.find({where: {id: options.rolesId}})
            if(!role) {
                return {
                    errors: [
                        {
                            field: 'Role not found',
                            message: 'invalid rolesId, please try again.'
                        }
                    ]
                }
            }
            const objUser = new User()
            objUser.age = options.age
            objUser.firstName = options.firstName
            objUser.lastName = options.lastName
            objUser.roles = role[0]
            objUser.id = id
            const results = await User.save(objUser)

            user = results
        } catch (error) {
            return error
        }

        req.session.userId = user.id;
        return { user }
    }
}