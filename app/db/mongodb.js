import { MongoClient, ObjectID } from 'mongodb';
import * as constants from './../constants'; // import constants

let uri;
if (constants.DEV_ENV) {
    uri = `mongodb://${constants.LOCAL_HOST}:${constants.MONGO_PORT}/${constants.DB_NAME}`;
} else {
    uri = `${constants.TEST_DB_URL}`;
}


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

const disconnectDB = () => _db.close()


export default { connectDB, getDB, disconnectDB };
