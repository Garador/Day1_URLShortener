import {Express} from 'express';
import ShorteningController from './shortener';
import RedirecterController from './redirecter';
import AuthController from './auth';

/**
 * @description Initializes the routes and start listening to them
 */
export class RoutesController {
    private static _instance:RoutesController = new RoutesController();

    constructor(){

    }

    public static get Instance(){
        return this._instance;
    }
    /**
     * 
     * @param app Initializes the app routes
     */
    async init(app:Express){
        AuthController.handle(app);
        RedirecterController.handle(app);
        ShorteningController.handle(app);
    }
}


export default RoutesController.Instance;