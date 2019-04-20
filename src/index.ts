import "reflect-metadata";
import express from 'express';
import Initializer from './utils/initializer';
import RoutesController from "./controllers";
import bodyParser from "body-parser";
import * as helmet from 'helmet'

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Helmet Guards
app.use(helmet.xssFilter())
app.use(helmet.frameguard())

Initializer.init()
.then(()=>{
    RoutesController.init(app);
}).catch((err)=>{
    console.log("ERROR INITIALIZING SYSTEM: ",err);
});


app.listen(3000, () => console.log('Listening on port 3000!'));