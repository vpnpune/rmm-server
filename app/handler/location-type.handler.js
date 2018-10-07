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
            let result = await DatabaseService.getOne(collectionName, ObjectId(id));
            return result;
        } catch (err) {
            throw err;
        }

    }
    // save object to db
    static async save(data) {
        try {

            let result = await DatabaseService.saveWithObjectId(collectionName, data);
            return result;
        } catch (err) {
            throw err;
        }
    }
    // update container
    static async updateOne(data) {
        try {
            data._id = ObjectId(data._id);
            let result = await DatabaseService.updateOneWithObjectId(collectionName, data);
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
    static async getNotInList(notInList) {
        try {

            const db = mongodb.getDB();
            let dataList = [];
            notInList.forEach(id => {
                dataList.push(ObjectId(id));
            });
            console.log(this.dataList);
            let result = await db.db().collection(collectionName).find({ "_id": { $nin: dataList } }).toArray();



            return result;
        } catch (err) {
            throw err;
        }

    }

}



