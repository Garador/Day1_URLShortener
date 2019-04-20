import DatabaseController from './database';

export class ComponentsInitializer {
    private static _instance:ComponentsInitializer = new ComponentsInitializer();

    constructor(){

    }

    public static get Instance(){
        return this._instance;
    }

    async init(){
        await DatabaseController.init();
    }
}


export default ComponentsInitializer.Instance;