import {Express} from 'express';
import DatabaseController from '../utils/database'  //TODO: Rename
import Validator from '../utils/validator'
import Cleaner from '../utils/cleaner';
import Config from '../utils/config'
import UrlEntity from '../typeorm/entity/url';
import { SHORTENING_ERROR } from '../enums/error';
import { API_PATHS } from '../enums/path';
import LogController from './logController';
import  AuthController from './auth';

export class ShorteningController {
    private static _instance:ShorteningController = new ShorteningController();

    private constructor(){

    }

    public static get Instance(){
        return this._instance;
    }

    public handle(app:Express){
        app.post(API_PATHS.SHORTEN_REQUEST, 
            LogController.log, 
            AuthController.signedInFilter,  async (req, res)=>{
            let urlRepo = DatabaseController.connection.getRepository(UrlEntity);
            if(!req.query.url){
                return res.sendStatus(400);
            }
            let cleanedUrl = Cleaner.cleanUrl(req.query.url);
            if(!Validator.isValidURL(Cleaner.cleanUrl(req.query.url))){
                return res.status(400).json({
                    error:SHORTENING_ERROR.INVALID_URL
                });
            }
            
            const foundRecord = await urlRepo.findOne({
                where:{
                    url:cleanedUrl
                }
            });
            
            if(foundRecord){
                return res.status(200).json({
                    url:Config.LocalAddress+"/"+foundRecord.code
                });
            }else{
                let record = urlRepo.create();
                record.url = cleanedUrl;
                await urlRepo.save(record);
                return res.status(200).json({
                    url:Config.LocalAddress+"/"+record.code
                });
            }
        });
    }
}

export default ShorteningController.Instance;