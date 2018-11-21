import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';
import mongodb from "./../db/mongodb";
import { addCreationDetails } from "./../db/user-audit";

/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.PERMISSION;


export class PermissionsHandler {
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
            console.log('result1: ',result);
            return result;
        } catch (err) {
            throw err;
        }

    }
    // save object to db
    static async save(data) {
        try {
            console.log(data);
            let result = await PermissionsHandler.savePermissions(collectionName,data);
            console.log('result : ',result);
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

    static async getByPermissionName(permissionName) {
        try {
            let criteria = {"permissionName": permissionName};
            let result = await  DatabaseService.findByCriteria(collectionName,criteria);
            console.log("Data: ",result);
            return result[0];
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    static async savePermissions(collectionName, data) {
        try {
            const db = mongodb.getDB();
            var bulk = await db.db().collection(collectionName).initializeUnorderedBulkOp();

            for(let row of data) {
                row._id = row.permissionName;
                bulk.insert(addCreationDetails(row));
            }
            return bulk.execute();
        } catch (err) {
            console.log(err);
            throw err;
        }
        
    }

}



