import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';
import mongodb from "../db/mongodb";


/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.LOCATION_TYPE;

const ObjectId = require('mongodb').ObjectID;

export class LocationTypeHandler {
    // get all items from collection
    static async getAll() {
        try {
            let result = await DatabaseService.getAll(collectionName);
            return result;
        } catch (err) {
            throw err;
        }

    }
    // get ONE object from db
    static async getOne(id) {
        try {
            let result = await DatabaseService.getOne(collectionName, id);
            return result;
        } catch (err) {
            throw err;
        }

    }
    // save object to db
    static async save(data) {
        try {

            let result = await DatabaseService.save(collectionName, data);
            return result.ops[0];
        } catch (err) {
            throw err;
        }
    }
    // update container
    static async updateOne(data) {
        try {
            let result = await DatabaseService.updateOne(collectionName, data);
            return result;
        } catch (err) {
            throw err;
        }
    }
    // Delete One container
    static async deleteOne(id) {
        try {
            // send objectId version
            let result = await DatabaseService.deleteOne(collectionName, id);
            return result;
        } catch (err) {
            throw err;
        }
    }
    static async getNotInList(dataList) {
        try {

            const db = mongodb.getDB();

            let result = await db.db().collection(collectionName).find({ "_id": { $nin: dataList } }).toArray();

            return result;
        } catch (err) {
            throw err;
        }

    }

}



