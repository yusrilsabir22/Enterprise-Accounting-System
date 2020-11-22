
import { Field, ObjectType } from 'type-graphql';
import { Request, Response } from "express";
import { Redis } from "ioredis";
import { createProductOrdersLoader } from './utils/createProductOrdersLoader';
// import { createUserLoader } from "./utils/createUserLoader";
// import { createUpdootLoader } from "./utils/createUpdootLoader";
export type MyContext = {
  req: Request & {session: any};
  redis: Redis;
  res: Response;
  productOrderLoader: ReturnType<typeof createProductOrdersLoader>;
};

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

export enum USER_TYPE  {
  OWNER = 1,
  WAREHOUSE = 2,
  CASHIER = 3
}