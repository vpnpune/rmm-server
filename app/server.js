// import express
import express from 'express';
import bodyParser from 'body-parser';
import * as constants from './constants'; // import constants
import routes from './routes';
import MongoDB from './db/mongodb';
import morgan from 'morgan';
import redis from 'redis';
import cors from 'cors';

const app = express(); // new server
app.use(cors());//Enable All CORS Requests

//JWT Token configuration
app.set('secret', `${constants.SECRET}`);//Secret Variable

// parse body params
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// use morgan to log requests to the console
app.use(morgan('dev'));

//API Endpoints
app.use('/api', routes);

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

// const client = redis.createClient(`${constants.REDIS_PORT}`);

export default app;