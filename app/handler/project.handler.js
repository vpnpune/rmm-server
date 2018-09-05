import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';


/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.PROJECT;


export class ProjectHandler {
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



