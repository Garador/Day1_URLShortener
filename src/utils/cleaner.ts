export class Cleaner {
    private static _instance:Cleaner = new Cleaner();

    constructor(){

    }

    public static get Instance(){
        return this._instance;
    }

    cleanUrl(data:string):string{
        return data.replace(/(^\"|\"$)|/g,'');
    }
}


export default Cleaner.Instance;