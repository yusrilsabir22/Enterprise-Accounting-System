import { Field, ObjectType } from 'type-graphql';
import { Request, Response } from "express";
import { Redis } from "ioredis";
// import { createUserLoader } from "./utils/createUserLoader";
// import { createUpdootLoader } from "./utils/createUpdootLoader";

export type MyContext = {
  req: Request & {session: any};
  redis: Redis;
  res: Response;
};

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}