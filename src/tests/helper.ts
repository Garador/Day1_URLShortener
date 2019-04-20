import * as request from 'request'

export class Helper {
    private static _instance:Helper = new Helper();

    constructor(){

    }

    public static get Instance(){
        return this._instance;
    }

    async makeRequest(properties:(request.UriOptions & request.CoreOptions) | (request.UrlOptions & request.CoreOptions)):Promise<{err:any, res:request.Response, data:any}>{
        console.log("Properties: ",properties);
        let response:any = await new Promise((accept)=>{
            if(properties.method === 'GET'){
                request.get(properties, (err, res, data) => {
                    accept({err, res, data});
                });
            }else if(properties.method === 'POST'){
                request.post(properties, (err, res, data) => {
                    accept({err, res, data});
                });
            }
        });
        return response;
    }
}


export default Helper.Instance;