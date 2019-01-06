import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';
import mongodb from "./../db/mongodb";

/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.CLIENT_PROJECT_PERMISSION;


export class ClientProjectPermissionHandler {
    // get all items from collection
    static async getAll() {
        try{
            const db = mongodb.getDB();
            let data = await db.db().collection(collectionName).aggregate(
                [
                    {"$match":{"deleted":{"$ne":true}}},
                    {"$unwind":"$clients"},
                    {"$unwind":"$projects"},
                    {"$lookup":
                        {"from":"client","localField":"clients","foreignField":"_id","as":"client"}
                    },
                    {"$unwind":"$client"},
                    {"$lookup":
                        {"from":"project","localField":"projects","foreignField":"_id","as":"project"}
                    },
                    {"$unwind":"$project"},
                    {"$group":
                        {
                            "_id":"$_id",
                            "client":{"$addToSet": "$client.name"},
                            "project":{"$addToSet": "$project.name"},
                            "userName":{"$first": "$userName"},
                            "clients":{"$addToSet":"$client._id"},
                            "projects":{"$addToSet":"$project._id"}
                        }
                    }
                ]).toArray();
            return data;
        } catch(err) {
            console.log(err);
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
            return result.ops[0];
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
            console.log(id);
            let result = await DatabaseService.softDeleteOne(collectionName,id);
            return result;
        } catch (err) {
            throw err;
        }
    }
}



