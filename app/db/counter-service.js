import mongodb from "./mongodb";
import app from './../server'
import * as Collection from './collection-constants';

const COUNTER = Collection.COUNTER;

export class CounterService {

    static async getCounter(collectionName, aliasName) {
        try{
            const db = mongodb.getDB();
            let criteria;
            if(null !== aliasName && undefined !== aliasName) {
                criteria = {"collectionName": collectionName, "aliasName": aliasName};
            } else {
                criteria = {"collectionName": collectionName};
            }
            
            let result = await db.db().collection(COUNTER).findOneAndUpdate(criteria, {$inc: {count:1}}, { upsert: true });
            
            if(result.lastErrorObject.updatedExisting) {
                return result.value.count+1;
            } else {
                return 1;
            }
        } catch(err) {
            return err;
        }
    }
}