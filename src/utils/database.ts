import {createConnection, Connection} from "typeorm";
import config from './config';

export class DatabaseUtil {
    private static _instance:DatabaseUtil = new DatabaseUtil();

    public connection:Connection;
    constructor(){

    }

    public static get Instance(){
        return this._instance;
    }

    public get name():string{
        
        return config.NodeEnv === "PRODUCTION" ? "production" : "testing";
    }

    async init():Promise<Connection>{
        this.connection = await createConnection(this.name);
        return this.connection;
    }
}


export default DatabaseUtil.Instance;