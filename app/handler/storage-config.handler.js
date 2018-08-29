import { DatabaseService } from "../db/database.service";
import mongodb from "../db/mongodb";
import * as Collection from '../db/collection-constants';


/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.STORAGE_CONFIG;


export class StorageConfigHandler {
    // get all items from collection
    static async getAll(key) {
        console.log("In Service");
        try {
            const db = mongodb.getDB();

            let result = await db.db().collection(collectionName).find({"conditionType":key}).toArray();
            return result;
        } catch (err) {
            console.log("In Service" +err);
            throw err;
        }

    }
    // get ONE object from db
    static async getOne(id) {
        try {
     
            let result = await  DatabaseService.getOne(collectionName,id);
            return result;
        } catch (err) {
            throw err;
        }

    }
    // save object to db
    static async save(data) {
        try {
            let result = await  DatabaseService.save(collectionName,data);
            return result;
        } catch (err) {
            throw err;
        }
    }
    // update container
    static async updateOne(data) {
        try {
            let result =  await DatabaseService.updateOne(collectionName,data);
            return result;
        } catch (err) {
            throw err;
        }
    }
    // Delete One container
    static async deleteOne(id) {
        try {
            let result = await DatabaseService.deleteOne(collectionName,id);
            return result;
        } catch (err) {
            throw err;
        }
    }
}



