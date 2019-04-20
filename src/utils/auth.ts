import Profile from "../typeorm/entity/profile";
import * as jsonwebtoken from 'jsonwebtoken'
import config from './config';
import { ROLES } from "../enums/roles";
import DatabaseUtil from "./database";

export interface JWT {
    user:{
        id:string,
        role:string
    }
};

export class AuthUtil {
    private static _instance:AuthUtil = new AuthUtil();

    constructor(){

    }

    public static get Instance(){
        return this._instance;
    }
    
    generateJWT(user:Profile):string{
        return jsonwebtoken.sign({
            user:{
                id:user.id,
                role:user.role
            }
        },config.JWTKey,{
            expiresIn: ("10h")
        });
    }

    isAdmin(jwt:JWT){
        return (jwt.user.role !== ROLES.ADMIN);
    }

    async getUser(jwt:JWT):Promise<Profile>{
        return await DatabaseUtil.connection.getRepository(Profile).findOne({
            where:{
                id: jwt.user.id
            }
        });
    }

    async isActive(jwt:JWT){
        let user = await this.getUser(jwt);
        return user && user.isActive();
    }

    decodeJWT(jwt:string):JWT|Error{
        try{
            return <JWT>jsonwebtoken.decode(jwt);
        }catch(e){
            return 
        }
    }
}


export default AuthUtil.Instance;