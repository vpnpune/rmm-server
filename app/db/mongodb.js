import { MongoClient, ObjectID } from 'mongodb';
import * as constants from './../constants'; // import constants
import * as Collection from '../db/collection-constants';

const pipeline = [
    {
      $project: { documentKey: false }
    }
  ];
let uri;
if (constants.DEV_ENV) {
    uri = `mongodb://${constants.DB_USERNAME}:${constants.DB_PASSWORD}@${constants.DB_URL}:${constants.MONGO_PORT}/${constants.DB_NAME}?ssl=false&authSource=admin&retryWrites=true`;
    //const uri = `mongodb://localhost:${constants.MONGO_PORT}/${constants.DB_NAME}`;
} else {
    uri = `${constants.TEST_DB_URL}`;
}

let _db

const connectDB = async (callback) => {
    try {
        MongoClient.connect(uri, { useNewUrlParser: true }, (err, db) => {
            _db = db
            
            const collection = db.db().collection('containerType');
            const changeStream = collection.watch({ fullDocument: 'updateLookup' });

            let resumeToken, newChangeStream;
            changeStream.on('change', next => {
                resumeToken = next._id;
                let obj = {
                    "operationType": next.operationType,
                    "document": next.fullDocument,
                    "collection": next.ns.coll
                };
                if(undefined !== next.updateDescription) {
                    obj["modifiedFields"] = next.updateDescription.updatedFields;
                } else {
                    obj["modifiedFields"] = null;
                }
                db.db().collection(Collection.ACTIVITY_HISTORY).save(obj);
                // changeStream.close();
            });
            return callback(err)
        })
    } catch (e) {
        throw e
    }
}

const getDB = () => _db

const disconnectDB = () => _db.close()


export default { connectDB, getDB, disconnectDB };
