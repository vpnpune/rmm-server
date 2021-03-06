import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';
import mongodb from "./../db/mongodb";
import { addCreationDetails } from "./../db/user-audit";

/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.PERMISSION;


export class PermissionsHandler {
    // get all items from collection
    static async getAll() {
        try{
            const db = mongodb.getDB();
            let data = await db.db().collection(collectionName).aggregate(
                [
                    {"$group":{
                        "_id":{"name":"$name", "url":"$url"},
                        "permission":{
                            "$addToSet":{"_id":"$_id","operation":"$operation","permissionName":"$permissionName"}}
                        }
                    }
                ]).toArray();
            return data;
        } catch(err) {
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
            let result = await PermissionsHandler.savePermissions(collectionName,data);
            return result.result;
        } catch (err) {
            throw err;
        }
    }
    // update container
    static async updateOne(data) {
        try {
            let criteria = {"name":data[0].name};
            await DatabaseService.deleteMany(collectionName,criteria);
            let result = await PermissionsHandler.savePermissions(collectionName,data);
            return false;
        } catch (err) {
            throw err;
        }
    }
    // Delete One container
    static async deleteOne(data) {
        try {
            let criteria = {"name":data};
            const db = mongodb.getDB();
            let aggregate = await db.db().collection(Collection.ROLES).aggregate(
                [
                    {"$unwind":"$permissions"},
                    {"$lookup":{"from":"permission","localField":"permissions","foreignField":"_id","as":"permission"}},{"$unwind":"$permission"},
                    {"$match":{"permission.name":data}},
                    {"$count":"count"}
                ]).toArray();
            
            if(aggregate && aggregate.length > 0) {
                return Error("It is assigned to Role(s), so unable to archieve.");
            } else {
                let result = await DatabaseService.deleteMany(collectionName,criteria);
                return result;
            }
            
        } catch (err) {
            return err;
        }
    }

    static async getByPermissionName(permissionName) {
        try {
            let criteria = {"permissionName": permissionName};
            let result = await  DatabaseService.findByCriteria(collectionName,criteria);
            return result[0];
        } catch (err) {
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
            throw err;
        }
        
    }

}



