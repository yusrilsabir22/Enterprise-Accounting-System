import "dotenv-safe/config";
// import { Request } from "express";
import jwt from 'jsonwebtoken'

/**
 * 
 * @param data is object that contains token information
 */
export const generateToken = (data: any): string => {
    const token = jwt.sign(data, process.env.SECRET_KEY, {expiresIn: 60 * 60 * 24})
    return token
}
// req: Request
export const decodeToken = (token: string, ): boolean => {
    const verify = jwt.decode(token)
    console.log(verify)
    
    return false
}

// export const checkUserId = ()