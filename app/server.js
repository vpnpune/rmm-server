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

const app = express(); // new server
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());//Enable All CORS Requests

//Send email Test data
var subject = fs.readFileSync(path.join(__dirname, 'template/testmailTemplate/subject.html'),{encoding:'utf-8'});
var body = fs.readFileSync(path.join(__dirname, 'template/testmailTemplate/body.html'),{encoding:'utf-8'});

var email = require('./emailSend');
var user = {firstName : 'test', lastName: 'Saboo'};

var sub = ejs.render(subject, user);
var text = ejs.render(body, user);
email.sendMail(sub, text);

// end this here


// swagger definition
var swaggerDefinition = {
    info: {
      title: 'Node Swagger API',
      version: '1.0.0',
      description: 'Demonstrating how to describe a RESTful API with Swagger',
    },
    
    host: 'https://rmm-server.herokuapp.com/',
    basePath: '/',
  };
//host: 'localhost:3000'
//host :'https://labmanus.herokuapp.com',
  // options for the swagger docs
  var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./**/routes/*.js','routes.js'],// pass all in array 
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
app.get('/swagger.json', function(req, res) {   
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
    console.log("error handler called", err);
    if (err.isBoom) {
        return res.status(err.output.statusCode).json(err.data);
    } else {
        return res.status(500).json("Internal server error");
    }
});

export default app;
