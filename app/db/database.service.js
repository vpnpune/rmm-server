import mongodb from "./mongodb";
import { addId } from "./id-generator";


export class DatabaseService {
    // get all items from collection
    static async getAll(collectionName) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).find({}).toArray();
            //console.log(JSON.stringify(data));
            return result;
        } catch (err) {
            throw err;
        }

    }
    // get ONE document from db.collection

    static async getOne(collectionName,id) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).findOne({ "_id": id });
            return result;
        } catch (err) {
            throw err;
        }

    }
    // save document to collection
    static async save(collectionName,data) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).save(addId(data));
            //console.log(JSON.stringify(data));
            return result;
        } catch (err) {
            throw err;
        }
    }
    // update one collection
    static async updateOne(collectionName,data) {
        try {
            console.log("Update call "+JSON.stringify(data));
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).update({"_id":data._id},data,{upsert:false});
            //console.log(JSON.stringify(data));
            return result;
        } catch (err) {
            throw err;
        }
    }
    // Delete One collection
    static async deleteOne(collectionName,id) {
        try {
            console.log("delete call");
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).deleteOne({"_id":id});
            //console.log(JSON.stringify(data));
            return result;
        } catch (err) {
            throw err;
        }
    }
}



