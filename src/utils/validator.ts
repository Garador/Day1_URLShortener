export class Validator {
    private static _instance:Validator = new Validator();

    constructor(){

    }

    public static get Instance(){
        return this._instance;
    }

    isValidURL(data:string):boolean{
        let reg = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/);
        return reg.test(data);
    }

    hasValidUsername(data:string):boolean{
        return /^[a-z0-9]{1,20}$/i.test(data);
    }

    hasValidPassword(data:string):boolean{
        return /^[\w\W]{4,20}$/.test(data);
    }
}


export default Validator.Instance;