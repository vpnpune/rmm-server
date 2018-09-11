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
            let result = await db.db().collection(collectionName).save(addId(data));
            //console.log(JSON.stringify(data));
            return result;
        } catch (err) {
            throw err;
        }
    }
    // update one collection
    static async updateOne(collectionName, data) {
        try {
            console.log("Update call " + JSON.stringify(data));
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).update({ "_id": data._id }, data, { upsert: false });
            //console.log(JSON.stringify(data));
            return result;
        } catch (err) {
            throw err;
        }
    }
    // Delete One collection
    static async deleteOne(collectionName, id) {
        try {
            console.log("delete call");
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).deleteOne({ "_id": id });
            //console.log(JSON.stringify(data));
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
                console.log("searchText " + pagination.searchText);
            }
            pagination.resultSet = await db.db().collection(collectionName).find({}).limit(parseInt(pagination.end)).skip(parseInt(pagination.start)).toArray();
            //@Todo : Working code need to revert if component if else works on client side
            //if(parseInt(pagination.start)===0){
            // console.log("IF");
            pagination.totalSize = await db.db().collection(collectionName).find({}).count();
            //}else{
            //  console.log("Else");
            //}

            return pagination;
        } catch (err) {
            throw err;
        }
    }


}



