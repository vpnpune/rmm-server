import { MongoClient,ObjectID } from 'mongodb';
import * as constants from './../constants'; // import constants

const uri = `mongodb://localhost:${constants.MONGO_PORT}/${constants.DB_NAME}`;
//const uri="mongodb://m001-student:gC5hQRkRdMGSn8J9@cluster0-shard-00-00-aknqy.mongodb.net:27017,cluster0-shard-00-01-aknqy.mongodb.net:27017,cluster0-shard-00-02-aknqy.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";

let _db

const connectDB = async (callback) => {
    try {
        MongoClient.connect(uri, { useNewUrlParser: true }, (err, db) => {
            _db = db
            return callback(err)
        })
    } catch (e) {
        throw e
    }
}

const getDB = () => _db
const getObjectId = ObjectID;

const disconnectDB = () => _db.close()


export default { connectDB, getDB, disconnectDB,getObjectId };
