import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';
import { addId } from "../db/id-generator";
import app from './../server';
import mongodb from "../db/mongodb";

/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.PROJECT;


export class DynamicFormHandler {
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
            let criteria = {"id": id, "createdBy": app.get('user')}
            let result = await  DatabaseService.findByCriteria(collectionName,criteria);
            return result.get();
        } catch (err) {
            throw err;
        }

    }
    // save object to db
    static async save(data) {
        try {
            const db = mongodb.getDB();
            let obj = addId(data);
            let result = await db.db().collection(collectionName).updateOne({ "_id": data.projectId }, { $push: {"sampleDefinition.dynamicFields":obj}});
            return result.result;
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



