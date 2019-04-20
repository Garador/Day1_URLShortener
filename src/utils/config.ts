export class Config {
    private static _instance:Config = new Config();

    constructor(){

    }

    public static get Instance(){
        return this._instance;
    }

    public get NodeEnv(){
        return process.env.NODE_ENV;
    }

    public get Host():string{
        return process.env.HOST || "http://localhost";
    }

    public get Port():string {
        return process.env.PORT || "3000";
    }

    public get JWTKey():string {
        return process.env.JWT_KEY || "l1k2j3j12n312l3b123jl";
    }

    public get LocalAddress():string {
        return this.Host+":"+this.Port;
    }

    isValidURL(data:string):boolean{
        let reg = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/);
        return reg.test(data);
    }
}


export default Config.Instance;