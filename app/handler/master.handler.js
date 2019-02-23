import { DatabaseService } from "../db/database.service";
import mongodb from "../db/mongodb";


/* SET COLLECTION NAME FIRST*/


export class MasterHandler {
    // get all items from collection
    static async getAll(collectionName) {

        try {

            let result = await DatabaseService.getAll(collectionName);
            return result;
        } catch (err) {

            throw err;
        }

    }
    // get ONE object from db
    static async getWithKey(collectionName,criteria) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).find(criteria).toArray();

            return result;
        } catch (err) {
            throw err;
        }

    }

}



