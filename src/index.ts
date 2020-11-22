import "reflect-metadata";
import "dotenv-safe/config";
import { Customers } from './entities/Customers';
import { OrderResolver } from './resolver/OrderResolver';
import { isAuth } from './middleware/isAuth';
import { ProductResolver } from './resolver/ProductResolver';
import { CategoryResolver } from './resolver/CategoryResolver';
import { Category } from './entities/Category';
import { Product } from './entities/Product';
import { RoleResolver } from './resolver/RoleResolver';
import { Role } from './entities/Role';
import { User } from './entities/User';
import { UserResolver } from './resolver/UserResolver';
import { __prod__, COOKIE_NAME } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { createConnection } from "typeorm";

import path from "path";
import { Order } from "./entities/Order";
import { ProductOrder } from "./entities/ProductOrder";
import { ProductOrderResolver } from "./resolver/ProductOrderResolver";
import { createProductOrdersLoader } from "./utils/createProductOrdersLoader";
import { File } from "./entities/File";

const main = async () => {
  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: false,
    migrations: [path.join(__dirname, "./migration/*")],
    entities: [User, Role, Category, Product, Order, Customers, ProductOrder, File],
    cli: {
      entitiesDir: "dist/entities",
      migrationsDir: "src/migration"
    }
  });
  // await conn.runMigrations();
  
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: __prod__ ? process.env.CORS_ORIGIN : 'http://localhost:3000',
      credentials: true,
    })
  );
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
        domain: __prod__ ? ".codeponder.com" : undefined,
      },
      saveUninitialized: false,
      resave: false,
    })
  );

  app.use("*",(req, _, next) => {
    // @ts-ignore
    console.log(req.hostname +" - " + req.method + " - " + req.session.userType)
    next()
  });

  app.use('/public', express.static(path.join(__dirname, 'public')))

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        RoleResolver,
        CategoryResolver,
        ProductResolver,
        OrderResolver,
        ProductOrderResolver
      ],
      validate: false,
      authChecker: isAuth,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      productOrderLoader: createProductOrdersLoader()
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log("server started on localhost:4001");
  });
};

main().catch((err) => {
  console.error(err);
});
