import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';
import { buildInsertObject, buildUpdateObject, addCreationDetails } from "../db/user-audit";
import mongodb from "../db/mongodb";

import logger from '../logger';
const log = logger.Logger;

/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.CLIENT;

// {
//     $project: { "fields": { "projects": 1, "clientAddress": 0, "_id": 0 } }

// }
export class ProjectHandler {
    // get all items from collection
    static async getAll(clientId) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).find(
                { _id: clientId }).project({projects:1})
            .toArray();
            return result;
        } catch (err) {
            throw err;
        }
    }
    // get ONE object from db
    static async getOne(clientId, projectId) {
        try {
            // let result = await DatabaseService.getOne(collectionName, projectId);
            const db = mongodb.getDB();
            console.log("collectionName: ",collectionName);
            // const cursor = db.db().collection(collectionName).find({
            //     _id: '1bz7bt1jnbjwpif'
            // });
            // const cursor = await db.db().collection('inventory').findOne(
            //     {"item": "journal"},
            //     {projection: {'instock':{$elemMatch: {'warehouse': 'Y'}}}
            //   });
            let cursor = await db.db().collection(collectionName).findOne(
                { '_id': clientId },
                { projection: {'projects':{$elemMatch: {'_id': projectId}}}
            });
            // console.log("Result: ", await cursor.count());

            return cursor;
        } catch (err) {
            throw err;
        }

    }
    // save object to db
    static async save(data) {
        const db = mongodb.getDB();
        try {
            console.log("project", data);
            let result = await db.db().collection(collectionName).updateOne({ _id: data.clientId },
                {
                    $push: { projects: buildInsertObject(data) }

                });

            //let result = await DatabaseService.save(collectionName, data);
            return result;
        } catch (err) {
            throw err;
        }
    }
    // update container
    static async updateOne(data) {
        const db = mongodb.getDB();

        try {
            let result = await db.db().collection(collectionName).updateOne(
                { _id: data.clientId, "projects._id": data._id },
                {
                    $set: { "projects.$": buildUpdateObject(data) }

                });
            return result;
        } catch (err) {
            throw err;
        }
    }
    // Delete One container
    static async deleteOne(id) {
        try {
            //  let result = await DatabaseService.deleteOne(collectionName, id);
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).findOne(
                {
                    _id: clientId,
                    "projects": { "_id": projectId }
                }
            );
            return result;
        } catch (err) {
            throw err;
        }
    }
}



