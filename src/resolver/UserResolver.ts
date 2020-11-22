import { COOKIE_NAME } from './../constants';
import { Role } from './../entities/Role';
import 'reflect-metadata';
import { MyContext, FieldError } from './../types';
import { User } from '../entities/User';
import { Arg, Authorized, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from 'argon2';
// import { getConnection } from 'typeorm';


/**
 * Response to the client
 */
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

/**
 * Input Type (Object) for User Register
 */
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

    @Field()
    email: string;

    @Field()
    username: string;

    @Field()
    password: string;
}

/**
 * Input Type (Object) for login
 */
@InputType()
export class UsernamePasswordInput {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
}

/**
 * User Resolver (Controllers) for Type Graphql
 */
@Resolver(User)
export class UserResolver {

    @Query(() => User, {nullable: true})
    async checkAuth(@Ctx() {req}: MyContext) {
        console.log()
        if(!req.session.userId) {
            return null
        }
        const results = await User.find({relations: ['roles'], where: {id: req.session.userId}})
        return results[0]
    }

    @Authorized(['owner'])
    @Query(() => [User])
    async getUsers() {
        let results = await User.find({relations: ['roles'], where: {}})
        return results
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UserRegister,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        let user;
        const hashedPassword = await argon2.hash(options.password);
        try {
            const idCount = (await User.find({})).length

            const id = options.rolesId * 1000 + idCount
            const role = await Role.find({where: {id: options.rolesId}})
            // check if role is not exist
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
            objUser.email = options.email
            objUser.username = options.username
            objUser.password = hashedPassword
            const results = await User.save(objUser)

            user = results
        } catch (error) {
            // Check if username has already exist
             if (error.code === "23505") {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "username already taken",
                        },
                    ],
                };
            }

            return {
                errors: [
                        {
                            field: "username",
                            message: error[0].message,
                        },
                    ],
            }
        }

        req.session!.userId = user?.id;
        
        return { user }
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("username") username: string,
        @Arg("password") password: string,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        console.log(username, password)
        const user = await User.find({relations: ['roles'],where: {username}})
        if(!user[0]) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "that username doesn't exist"
                    }
                ]
            }
        }

        const valid = await argon2.verify(user[0].password, password)
        if(!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "incorrect password"
                    }
                ]
            }
        }
        req.session.userId = user[0].id
        req.session.userType = user[0].roles.title
        console.log(req.session.userId)
        return {user: user[0]}
    }

    @Mutation(() => Boolean)
    logout(@Ctx() {req, res}: MyContext)  {
        return new Promise((resolve) => {
            req.session.destroy((err: any) => {
                res.clearCookie(COOKIE_NAME);
                if(err) {
                    console.log(err)
                    resolve(false)
                    return
                }

                resolve(true)
            })
        })
    }
}