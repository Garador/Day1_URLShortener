import {expect} from 'chai';
import Helper from './helper';
import {API_PATHS} from '../enums/path'

describe("Should test the main endpoints",()=>{
    let shortenedURL = "";
    let JWT = "";

    let userData = {
        username:"pepe",
        password:"pepe3233"
    };

    it("Should create a new user", async function(){
        let callURL = `http://localhost:3000${API_PATHS.AUTH_USER}`;
        let result = await Helper.makeRequest({
            uri: callURL,
            method:'POST',
            body:userData,
            json: true,
            headers: {'User-Agent': 'request', 'Content-Type':'application/json'}
        });        
        let parsedData = result.res.body;
        expect(parsedData['error']).to.be.eq(undefined);
    });

    it("Should log-in", async function(){
        let callURL = `http://localhost:3000${API_PATHS.AUTH_LOGIN}`;
        let result = await Helper.makeRequest({
            uri: callURL,
            method:'POST',
            body:userData,
            json: true,
            headers: {'User-Agent': 'request', 'Content-Type':'application/json'}
        });
        expect(result.res.body['error']).to.be.eq(undefined);
        expect(typeof result.res.body['jwt']).to.be.eq("string");
        JWT = result.res.body['jwt'];
    });

    it('Should test the shortening endpoint', async function(){
        this.timeout(10000);
        let callURL = `http://localhost:3000${API_PATHS.SHORTEN_REQUEST}?url="http://www.google.com"`;
        let result = await Helper.makeRequest({
            uri: callURL,
            method: 'POST',
            json: true,
            headers: {'User-Agent': 'request', 'Authorization':JWT, 'Content-Type':'application/json'}
        });
        shortenedURL = result.res.body.url;
        expect(result.res.body.error).to.not.be.eq("string");
        expect(typeof shortenedURL).to.be.eq("string");
    });

    it("Should fetch all users", async function(){
        this.timeout(10000);
        let callURL = `http://localhost:3000${API_PATHS.AUTH_USER}`;
        let result = await Helper.makeRequest({
            uri: callURL,
            method: 'GET',
            json: true,
            headers: {'User-Agent': 'request', 'Authorization':JWT, 'Content-Type':'application/json'}
        });
        expect(result.res.body['error']).to.be.eq(undefined);
        expect(result.res.body['data']).to.not.be.eq(undefined);
        expect(result.data['data'].length).to.be.greaterThan(0);
    });


});