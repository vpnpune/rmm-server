import mongodb from "./mongodb";
import { addId } from "./id-generator";
import { buildInsertObject, buildUpdateObject } from "./user-audit";


export class DatabaseService {
    // get all items from collection
    static async getAll(collectionName) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).find({}).toArray();
            return result;
        } catch (err) {
            throw err;
        }

    }
    // get ONE document from db.collection

    static async getOne(collectionName, id) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).findOne({ "_id": id });
            return result;
        } catch (err) {
            throw err;
        }

    }
    // save document to collection
    static async save(collectionName, data) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).save(buildInsertObject(data));
            return result;
        } catch (err) {
            throw err;
        }
    }
    // update one collection
    static async updateOne(collectionName, data) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).replaceOne({ "_id": data._id }, { $set: buildUpdateObject(data) }, { upsert: false });
            return result;
        } catch (err) {
            throw err;
        }
    }

    // Delete One collection
    static async deleteOne(collectionName, id) {
        try {
            
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).deleteOne({ "_id": id });
            return result;
        } catch (err) {
            throw err;
        }

    }

    // get all items from collection for pagination
    static async getPageData(collectionName, pagination) {
        try {
            const db = mongodb.getDB();
            if (pagination.searchText != undefined) {
                
            }
            pagination.resultSet = await db.db().collection(collectionName).find({}).limit(parseInt(pagination.end)).skip(parseInt(pagination.start)).toArray();
            //@Todo : Working code need to revert if component if else works on client side
            //if(parseInt(pagination.start)===0){
            pagination.totalSize = await db.db().collection(collectionName).find({}).count();
            //}else{
            //  
            //}

            return pagination;
        } catch (err) {
            throw err;
        }
    }
    // ObjectId;

    // save document to collection
    static async saveWithObjectId(collectionName, data) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).save(addCreationDetails(data));
            //
            return result;
        } catch (err) {
            throw err;
        }
    }

     // update one collection
     static async updateOneWithObjectId(collectionName, data) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).replaceOne({ "_id": data._id }, { $set: buildUpdateObject(data) }, { upsert: false });
            return result;
        } catch (err) {
            throw err;
        }
    }

}



