import { User } from './../entities/User';
import { MyContext } from "src/types";
import { AuthChecker} from "type-graphql";
export const isAuth: AuthChecker<MyContext> = async ({context}, roles): Promise<boolean> => {
    let auth = false
    const user = await User.find({relations: ['roles'], where: {id: context.req.session.userId}});
    if(!user[0]) {
        throw new Error('not authenticated')
    } else {
        auth = roles.includes(user[0].roles.title)
        if(!auth) {
            throw new Error('missing privilege')
        }
    }
    return auth
}