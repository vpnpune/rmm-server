import mongodb from "./mongodb";
import { buildInsertObject, buildUpdateObject, addCreationDetails } from "./user-audit";
import { SOFT_DELETE_FIND_QUERY } from "../model/generic-queries";
import app from './../server'
import uniqid from "uniqid";


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
            throw err;
        }
    }
    // update one collection 
    // TODO rename as Replace One
    static async updateOne(collectionName, data) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).updateOne({ "_id": data._id }, { $set: buildUpdateObject(data) }, { upsert: false });
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

    // Delete One collection
    static async deleteMany(collectionName, criteria) {
        try {

            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).deleteMany(criteria);
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
            throw err;
        }
    }

    static async bulkSave(collectionName, data) {
        try {

            const db = mongodb.getDB();
            var bulk = await db.db().collection(collectionName).initializeUnorderedBulkOp();

            for (let row of data) {
                bulk.insert(buildInsertObject(row));
            }

            return bulk.execute();
        } catch (err) {
            throw err;
        }
    }

    static async findByCriteria(collectionName, criteria, projection) {
        const db = mongodb.getDB();
        let result = await db.db().collection(collectionName).find(criteria).project(projection).toArray();
        return result;
    }

    // use for all fields with pagination without projection
    static async getPageDataFindProjection(collectionName, pagination, criteria, projection) {
        try {
            const db = mongodb.getDB();
            pagination.resultSet = await db.db().collection(collectionName).find(criteria).project(projection).limit(pagination.end).skip(pagination.start).toArray();
            //@Todo : Working code need to revert if component if else works on client side
            //if(parseInt(pagination.start)===0){
            pagination.totalSize = await db.db().collection(collectionName).find({ "referenceNo": new RegExp(/^'BD'/) }).count();
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
    static async getAll(collectionName, projection) {
        try {
            const db = mongodb.getDB();
            let resultSet = await db.db().collection(collectionName).find(SOFT_DELETE_FIND_QUERY).project(projection).toArray();

            return resultSet;
        } catch (err) {
            throw err;
        }
    }

    static async getPageAggregate(collectionName, pagination, criteria, projection) {
        try {

            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).aggregate([
                {
                    "$facet": {
                        "totalData": [
                            { "$match": criteria },
                            { "$project": projection },
                            { "$skip": parseInt(pagination.start) },
                            { "$limit": parseInt(pagination.end) }
                        ],
                        "totalCount": [
                            { "$match": criteria },
                            { "$count": "count" }
                        ]
                    }
                }
            ]).toArray();
            if (result && result.length > 0 && result[0].totalCount[0]) {
                pagination.resultSet = result[0].totalData
                pagination.totalSize = result[0].totalCount[0].count;
            } else {
                pagination.resultSet = [];
                pagination.totalSize = 0;
            }
            return pagination;
        } catch (err) {
            throw err;
        }

    }
    static async bulkUpsert(collectionName, data) {
        try {



            const db = mongodb.getDB();
            // let result = await db.db().collection(collectionName).updateMany(
            //     {},
            //     data,
            //     { upsert: true, }
            // );
            // return result;
            var bulk = await db.db().collection(collectionName).initializeUnorderedBulkOp();

            for (let row of data) {
                if (row._id && row._id.length > 0) {

                } else {
                    row._id = uniqid()
                }



                // row._id = row._id && row._id.length > 0 ? row._id : uniqid();
                bulk.find({ _id: row._id }).upsert().updateOne(
                    {
                        equipmentId: row.equipmentId,
                        clientId: row.clientId,
                        createdBy: row.createdBy ? row.createdBy : app.get('user'),
                        createdOn: row.createdOn ? row.createdOn : new Date(),
                        modifiedBy: app.get('user'),
                        modifiedOn: new Date()
                    }
                );
            }

            return bulk.execute();
        } catch (err) {
            throw err;
        }
    }

    // Delete One collection	    // Delete One collection
    static async deleteOne(collectionName, id) {

        try {
            console.log("delete call");
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).deleteOne({ "_id": id });
            return result;
        }
        catch (err) {
            throw err;
        }
    }
}



