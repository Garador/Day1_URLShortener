import DatabaseController from '../utils/database'  //TODO: Rename
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { LOG_EVENT_TYPES, ACTION_NAMES } from '../enums/logs';
import Log from '../typeorm/entity/log';

export class LogController {
    private static _instance:LogController = new LogController();

    private constructor(){

    }

    public static get Instance(){
        return this._instance;
    }
    /**
     * @description Logs-in a call to the server into the database
     * @param req Request object for the request
     * @param res Response object for the request
     * @param next Next callback
     */
    public async log(req:Request, res:Response, next:NextFunction){
        let logRepo = DatabaseController.connection.getRepository(Log);
        let log:Log = logRepo.create();
        log.eventServerTime = new Date();
        try{
            if(
                (<any>LOG_EVENT_TYPES)[req.method]
                && (<any>LOG_EVENT_TYPES)[req.method][req.path]
            ){
                log.eventType = <string>(<any>LOG_EVENT_TYPES)[req.method][req.path];
                log.eventData = LogController._getLogData(req);
                await logRepo.save(log);
            }else{
                if(req.method === "GET"){
                    log.eventType = <string>(<any>LOG_EVENT_TYPES)["SPECIAL"]["*"];
                }else{
                    log.eventType = <string>(<any>LOG_EVENT_TYPES)["SPECIAL"]["UNKNOWN"];;
                }
                await logRepo.save(log);
            }
        }catch(e){
            console.log("Error saving log data: ");
            console.log(e);
        }
        return next();
    }



    /**
     * @description Generates metadata depending on he actions being called
     * @param req Request object to analize
     */
    private static _getLogData(req:Request):string{
        let eventType = <string>(<any>LOG_EVENT_TYPES)[req.method][req.path];
        if(eventType === ACTION_NAMES.LOG_IN){
            return JSON.stringify({
                username:req.body['username']
            });
        }else if(eventType === ACTION_NAMES.CREATE_ACCOUNT){
            return JSON.stringify({
                username:req.body['username']
            });
        }else if(eventType === ACTION_NAMES.SHORTEN_REQUEST){
            return JSON.stringify({
                query:req.query.url
            });
        }else if(eventType === ACTION_NAMES.UNKNOWN){
            return "";
        }
    }
}

export default LogController.Instance;