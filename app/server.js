// import express
import express from 'express';
import bodyParser from 'body-parser';
import * as constants from './constants'; // import constants
import routes from './routes';
import MongoDB from './db/mongodb';
import morgan from 'morgan';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import ejs from 'ejs';
import fs from 'fs';
import ApplicationError from './model/application-error';
import { INTERNAL_SERVER_ERROR } from './constants';

const app = express(); // new server
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());//Enable All CORS Requests

var subject = fs.readFileSync(path.join(__dirname, 'template/testmailTemplate/subject.html'), { encoding: 'utf-8' });
var body = fs.readFileSync(path.join(__dirname, 'template/testmailTemplate/body.html'), { encoding: 'utf-8' });

var email = require('./emailSend');
var user = { firstName: 'test', lastName: 'Saboo' };

var sub = ejs.render(subject, user);
var text = ejs.render(body, user);
//email.sendMail(sub, text);


// end this here


// swagger definition
let HOST_URL;
if (constants.DEV_ENV) {
    HOST_URL = `${constants.LOCAL_HOST}:${constants.LOCAL_PORT}/`;

} else {
     HOST_URL = `${constants.TEST_BASE_URL}`;
}
var swaggerDefinition = {
    info: {
        title: 'Node Swagger API',
        version: '1.0.0',
        description: 'Demonstrating how to describe a RESTful API with Swagger',
    },

    host: HOST_URL,
    basePath: '/',
};
//host: 'localhost:3000'
// options for the swagger docs
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./**/routes/*.js', 'routes.js'],// pass all in array 
};
// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

//JWT Token configuration
app.set('secret', `${constants.SECRET}`);//Secret Variable

// parse body params
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// use morgan to log requests to the console
app.use(morgan('dev'));

//API Endpoints
app.use('/api', routes);

// serve swagger
app.get('/swagger.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});


// start app on PORT
app.listen(constants.PORT, () => console.log(`Started server on ${constants.PORT}`));

MongoDB.connectDB(async (err) => {
    if (err) throw err
    else console.log("Mongo connected successfully");
})

app.use(function (err, req, res, next) {
    
    if (err.isBoom) {
        return res.status(err.output.statusCode).send(new ApplicationError(err.data, err.output.statusCode));
    } else {
        
        let errorCode = err.status || 500;
        let message = err.message || INTERNAL_SERVER_ERROR;
        return res.status(errorCode).send(new ApplicationError(message, errorCode));
    }
});

export default app;
