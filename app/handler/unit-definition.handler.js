import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';
import mongodb from "../db/mongodb";


/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.UNIT_DEFINITION;


export class UnitDefinitionHandler {
    // get all items from collection
    static async getAll() {
        try {
            const db = mongodb.getDB();
            let data = await db.db().collection(collectionName).aggregate(
                [
                    {"$match":
                        {"deleted":{"$ne":true}}
                    },
                    {"$lookup":
                        {"from":"unitGroup","localField":"unitGroup._id","foreignField":"_id","as":"unit"}
                    },
                    {"$unwind":"$unit"},
                    {"$match":
                        {"unit.deleted":{"$ne":true}}
                    }
                ]).toArray();
            return data;
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
            let result = await DatabaseService.softDeleteOne(collectionName, id);
            return result;
        } catch (err) {
            throw err;
        }
    }


}



