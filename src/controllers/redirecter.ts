import {Express} from 'express';
import DatabaseController from '../utils/database'  //TODO: Rename
import UrlEntity from '../typeorm/entity/url';
import { REDIRECT_ERROR } from '../enums/error';
import LogController from './logController';

export class RedirecterController {
    private static _instance:RedirecterController = new RedirecterController();

    private constructor(){

    }

    public static get Instance(){
        return this._instance;
    }

    public handle(app:Express){

        app.get("/*", LogController.log, async (req, res)=>{
            let urlRepo = DatabaseController.connection.getRepository(UrlEntity);
            let code = req.url.split(/\W/)[1];
            let record = await urlRepo.findOne({
                where:{
                    code:code
                }
            });
            if(record){
                return res.status(301).redirect(record.url);
            }else{
                return res.status(404).json({
                    error:REDIRECT_ERROR.NOT_FOUND
                });
            }
        });
    }
}

export default RedirecterController.Instance;