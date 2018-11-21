import mongodb from "./mongodb";
import { buildInsertObject, buildUpdateObject, addCreationDetails } from "./user-audit";


export class DatabaseService {
    // get all items from collection
    // static excludeSoftDeleted =
    //     {
    //         $or: [{ "deleted": { $exists: true, $eq: false } }, { "deleted": { $exists: false } }]
    //     };

    static async getAll(collectionName) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).find({}).toArray();
            return result;
        } catch (err) {
            throw err;
        }

    }
    static async getAllExceptSoftDeleted(collectionName) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).find(
                {
                    $or: [{ "deleted": { $exists: true, $eq: false } }, { "deleted": { $exists: false } }]
                }
            ).toArray();
            return result;
        } catch (err) {
            throw err;
        }

    }
    // get ONE document from db.collection

    static async getOne(collectionName, id) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).findOne({ "_id": id,
            $or: [{ "deleted": { $exists: true, $eq: false } }, { "deleted": { $exists: false } }]
        });
            return result;
        } catch (err) {
            throw err;
        }

    }
    // save document to collection
    static async save(collectionName, data) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).insertOne(buildInsertObject(data));
            return result;
        } catch (err) {
            console.log('error : ',err);
            throw err;
        }
    }
    // update one collection
    static async updateOne(collectionName, data) {
        try {
            const db = mongodb.getDB();
            console.log(data);
            let result = await db.db().collection(collectionName).updateOne({ "_id": data._id }, { $set: buildUpdateObject(data) }, { upsert: false });
            return result;
        } catch (err) {
            console.log(err);
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
            pagination.resultSet = await db.db().collection(collectionName).find( {
                $or: [{ "deleted": { $exists: true, $eq: false } }, { "deleted": { $exists: false } }]
            }).limit(parseInt(pagination.end)).skip(parseInt(pagination.start)).toArray();
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
    static async saveWithoutAutoId(collectionName, data) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).insertOne(addCreationDetails(data));
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

    // Delete One collection
    static async softDeleteOne(collectionName, id) {
        try {

            const db = mongodb.getDB();

            let result = await db.db().collection(collectionName).updateOne({ "_id": id }, { $set: { "deleted": true } });
            return result;
        } catch (err) {
            throw err;
        }
    }
    static async findByCriteria(collectionName, criteria) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).find(criteria).toArray();
            return result;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    static async bulkSave(collectionName, data) {
        try {

            const db = mongodb.getDB();
            var bulk = await db.db().collection(collectionName).initializeUnorderedBulkOp();

            for(let row of data) {
                bulk.insert(buildInsertObject(row));
            }

            return bulk.execute();
        } catch (err) {
            console.log(err);
            throw err;
        }
        
    }

}



