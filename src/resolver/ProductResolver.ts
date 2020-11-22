import { processUpload } from './../utils/processUpload';
import 'reflect-metadata';
import path from 'path';
import { getConnection } from 'typeorm';
import { Category } from './../entities/Category';
import { Product } from './../entities/Product';
import { FieldError } from './../types';
import { Arg, Authorized, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import {Stream} from 'stream'
import { createWriteStream } from 'fs';
import { GraphQLUpload } from 'apollo-server-express';
import { File } from '../entities/File';

@ObjectType()
class ProductResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Product, { nullable: true })
  product?: Product;
}

export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  name: string;
  type: string;
  createReadStream: () => Stream;
}

@Resolver(Product)
export class ProductResolver {
    @Authorized(['owner', 'admin warehouse'])
    @Query(() => [Product])
    async getProducts() {
        let results = await Product.find({relations: ['category', 'files'], where: {}})
        return results
    }

    @Authorized(['owner', 'admin warehouse'])
    @Mutation(() => ProductResponse)
    async insertNewProduct(
        @Arg("name") name: string,
        @Arg("categoryID") cat_id: string,
        @Arg("files", () => [GraphQLUpload]) files: [Upload]
    ): Promise<ProductResponse> {
        let product;
        let images: any = [];
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

            const upload = async () => {
                return await Promise.all(files.map(processUpload))
            }

            const is = await upload()
            // console.log(is)
            images = is.map((value, i) => {
                const img: Partial<File> = {
                    id: id+'-'+i,
                    name: value.filename,
                    location: value.location
                }
                return img
            })

            console.log(images)
            if(images.length > 0) {

                const mF = await File.save(images)
                console.log(mF)
                const newProduct = new Product()
                newProduct.id = id
                newProduct.category = cat[0]
                newProduct.name = name
                newProduct.files = mF
                const results = await Product.save(newProduct)
                product = results
                return {product}
            } else {
                return {
                    errors: [
                        {
                            field: 'file upload',
                            message: 'file mus be images'
                        }
                    ]
                }
            }
            
        } catch (error) {
            return {
                    errors: [
                        {
                            field: 'Insert New Order',
                            message: error.message
                        }
                    ]
                }
        }
    }

    @Mutation(() => Boolean)
    async insertNewImage(
        @Arg("file", () => GraphQLUpload) {createReadStream, filename}: Upload
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const pathname = path.join(__dirname, '..', 'public', filename);
            return createReadStream()
                .pipe(createWriteStream(pathname))
                .on("finish", async () => {
                    
                    return resolve(true)
                })
                .on("error", () => reject(false))
        })
    }

    @Authorized(['owner', 'warehouse'])
    @Mutation(() => ProductResponse)
    async updateProduct(
        @Arg("name") name: string,
        @Arg("value") value: string,
        @Arg("id") id: string
    ): Promise<ProductResponse> {
        let product: Product;
        try {
            const results = await getConnection()
            .createQueryBuilder()
            .update(Product)
            .set({
                [name]: name==="price" ? parseInt(value) : value
            })
            .where("id = :id", {id})
            .returning('*')
            .execute()
            product = results.raw[0]
        } catch (error) {
            return {
                errors: [
                    {
                        field: 'updateProduct',
                        message: error[0].message
                    }
                ]
            }
        }

        return {product}
    }
}