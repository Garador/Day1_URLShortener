import {Express} from 'express';
import DatabaseController from '../utils/database'  //TODO: Rename
import Validator from '../utils/validator';
import Profile from '../typeorm/entity/profile';
import AuthUtil from '../utils/auth';
import { ROLES } from '../enums/roles';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import LogController from './logController';
import { API_PATHS } from '../enums/path';
import { USER_CREATION_ERROR, USER_LISTING_ERROR, USER_LOGIN_ERROR, USER_AUTH_ERROR } from '../enums/error';

/**
 * @description Handles user-related authentication functions
 */
export class AuthController {
    private static _instance:AuthController = new AuthController();

    private constructor(){

    }

    public static get Instance(){
        return this._instance;
    }

    public handle(app:Express){

        /**
         * @description Handles the User Log-In action
         */
        app.post(API_PATHS.AUTH_USER, LogController.log, async (req, res)=>{
            let {username, password} = req.body;
            if(!this.hasValidUsernameAndPassword(username, password)){
                console.log({
                    username, password
                });
                return res.status(400).json({
                    error:USER_CREATION_ERROR.INVALID_DATA
                });
            }
            let userRepo = DatabaseController.connection.getRepository(Profile);
            let record = await userRepo.findOne({
                where:{
                    username
                }
            });
            if(record){
                return res.status(409).json({
                    error:USER_CREATION_ERROR.USER_ALREADY_EXISTS
                });
            }
            let recordCount = await userRepo.count();

            let newRecord = await userRepo.create();
            newRecord.role = (recordCount <1) ? ROLES.ADMIN : ROLES.USER;
            newRecord.username = username;
            newRecord.setPassword(password);
            try{
                await userRepo.save(newRecord);
            }catch(e){
                return res.status(500).json({
                    error:USER_CREATION_ERROR.INTERNAL_ERROR
                });
            }
            
            return res.sendStatus(200);
        });

        //Handles the user listing. Returns a list with all users.
        app.get(API_PATHS.AUTH_USER, this.signedInFilter, this.adminFilter, async (req, res)=>{
            let {skip, limit} = req.query;
            try{
                let result = await DatabaseController.connection.getRepository(Profile).find({
                    skip: (skip && parseInt(skip) === parseInt(skip)) ? parseInt(skip) : 0,
                    take: (limit && parseInt(limit) === parseInt(limit)) ? parseInt(limit) : 5,
                });
                return res.status(200).json({
                    data:result
                });
            }catch(e){
                return res.status(200).json({
                    data:USER_LISTING_ERROR.INTERNAL_ERROR
                });
            }
        });

        //Handles the user log-in. Returns a JWT
        app.post(API_PATHS.AUTH_LOGIN, async (req, res)=>{
            let {username, password} = req.body;
            if(!this.hasValidUsernameAndPassword(username, password)){
                return res.status(400).json({
                    error:USER_LOGIN_ERROR.INVALID_DATA_PROVIDED
                });
            }
            let userRepo = DatabaseController.connection.getRepository(Profile);
            let record = await userRepo.findOne({
                where:{
                    username
                }
            });
            if(!record){
                return res.status(409).json({
                    error:USER_LOGIN_ERROR.USER_DOES_NOT_EXIST
                });
            }
            if(record.isActive() && record.hasPassword(password)){
                //Generate the JWT
                let JWT = AuthUtil.generateJWT(record);
                return res.status(200).json({
                    jwt:JWT
                });
            }else{
                if(!record.isActive()){
                    return res.status(403).json({
                        error:USER_LOGIN_ERROR.NON_ACTIVE_STATUS
                    })
                }else{
                    return res.status(400).json({
                        error:USER_LOGIN_ERROR.INCORRECT_PASSWORD
                    });
                }
            }
        });
    }


    /**
     * @description Filters and lets only admins to continue
     * @param req Request object for the Request
     * @param res Response object for the Request
     * @param next Next callback for the Request
     */
    adminFilter(req:Request, res:Response, next:NextFunction){
        let JWT = req.header("Authorization");
        if(!JWT){
            return res.status(401).json({
                error:USER_AUTH_ERROR.LOGIN_REQUIRED
            });
        }
        let decodedJWT = AuthUtil.decodeJWT(JWT);
        if(decodedJWT instanceof Error){
            return res.status(400).json({
                error:USER_AUTH_ERROR.INVALID_TOKEN_PROVIDED
            });
        }

        if(AuthUtil.isAdmin(decodedJWT)){
            return res.status(403).json({
                error:USER_AUTH_ERROR.ADMIN_PRIVILEDGES_REQUIRED
            });
        }
        next();
    }

    /**
     * @description Filters unsigned calls (without an Authorization header with a JWT)
     * @param req Request object for the Request
     * @param res Response object for the Request
     * @param next Next callback for the Request
     */
    async signedInFilter(req:Request, res:Response, next:NextFunction){
        let JWT = req.header("Authorization");
        if(!JWT){
            return res.status(401).json({
                error:USER_AUTH_ERROR.LOGIN_REQUIRED
            });
        }
        let decodedJWT = AuthUtil.decodeJWT(JWT);
        if(decodedJWT instanceof Error){
            return res.status(400).json({
                error:USER_AUTH_ERROR.INVALID_TOKEN_PROVIDED
            });
        }
        
        let user = await AuthUtil.getUser(decodedJWT);
        if(!user){
            return res.status(403).json({
                error:USER_AUTH_ERROR.CREATED_ACCOUNT_REQUIRED
            });
        }
        if(!await AuthUtil.isActive(decodedJWT)){
            return res.status(403).json({
                error:USER_AUTH_ERROR.ACTIVE_STATE_REQUIRED
            });
        }
        return next();
    }

    /**
     * @description Analizes an username and password and checks for their syntactical validity
     * @param username Username to be analized
     * @param password Raw password to be analized
     */
    hasValidUsernameAndPassword(username:string, password:string){
        return (!!username && Validator.hasValidUsername(username)) && (!!password && Validator.hasValidPassword(password));
    }
}

export default AuthController.Instance;