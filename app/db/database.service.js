import mongodb from "./mongodb";
import { addId } from "./id-generator";
import { buildInsertObject, buildUpdateObject, addCreationDetails } from "./user-audit";
import { SOFT_DELETE_FIND_QUERY } from "../model/generic-queries";


export class DatabaseService {
    // get all items from collection
    // static excludeSoftDeleted =
    //     {
    //         $or: [{ "deleted": { $exists: true, $eq: false } }, { "deleted": { $exists: false } }]
    //     };

    static async getAll(collectionName) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).find().toArray();
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
            let result = await db.db().collection(collectionName).findOne({
                "_id": id,
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
            console.log('error : ', err);
            throw err;
        }
    }
    // update one collection 
    // TODO rename as Replace One
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
            pagination.resultSet = await db.db().collection(collectionName).find({
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
    // NEW Template Queries
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
    static async findByCriteria(collectionName, criteria,projection) {
        const db = mongodb.getDB();
        let result = await db.db().collection(collectionName).find(criteria).project(projection).toArray();
        return result;
    }




    // use for all fields with pagination without projection
    static async getPageDataFindProjection(collectionName, pagination, criteria, projection) {
        try {
            const db = mongodb.getDB();
            pagination.resultSet = await db.db().collection(collectionName).find(criteria).project(projection).limit(parseInt(pagination.end)).skip(parseInt(pagination.start)).toArray();
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
    static async getPagedDataWithAggregationAndProjection(collectionName, pagination, criteria, projection) {
        try {

            const db = mongodb.getDB();
            if (pagination.searchText != undefined) {

            }
            pagination.resultSet = await db.db().collection(collectionName).aggregate(

                [{ $match: criteria }]

            ).project(projection
            ).limit(parseInt(pagination.end)).skip(parseInt(pagination.start)).toArray();

            //@Todo : Working code need to revert if component if else works on client side
            //if(parseInt(pagination.start)===0){
            //pagination.totalSize = await db.db().collection(collectionName).find({}).count();

            return pagination;
        } catch (err) {
            throw err;
        }

    }

    static async getOneFind(collectionName, criteria, projectionDoc) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).findOne(
                criteria,
                { projection: projectionDoc }
            );
            //let result = await db.db().collection(collectionName).findOne(criteria);
            console.log(result)
            return result;
        } catch (err) {
            throw err;
        }

    }
    static async getOneAggregation(collectionName, criteria, projection) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).aggregate(
                [{ $match: criteria }]).
                project(
                    projection
                )
                .toArray();
            return result;
        } catch (err) {
            throw err;
        }

    }
    static async updateByCriteria(collectionName, criteria, data) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).updateOne(criteria, { $set: buildUpdateObject(data) }, { upsert: false });
            return result;
        } catch (err) {
            throw err;
        }
    }
 // use for all fields with pagination without projection
 static async getAll(collectionName,projection) {
    try {
        const db = mongodb.getDB();
        let resultSet = await db.db().collection(collectionName).find(SOFT_DELETE_FIND_QUERY).project(projection).toArray();
        
        return resultSet;
    } catch (err) {
        throw err;
    }
}


}



