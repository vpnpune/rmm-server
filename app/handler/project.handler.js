import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';
import { buildInsertObject, buildUpdateObject, addCreationDetails } from "../db/user-audit";
import mongodb from "../db/mongodb";

import logger from '../logger';
const log = logger.Logger;
import app from './../server'
import { SOFT_DELETE_FIND_QUERY } from "../model/generic-queries";


/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.CLIENT;

// {
//     $project: { "fields": { "projects": 1, "clientAddress": 0, "_id": 0 } }

// }

// need to test
export class ProjectHandler {
    // get all items from collection
    static async getAll(clientId) {
        try {
            const db = mongodb.getDB();
            //     let criteria = Object.create(SOFT_DELETE_FIND_QUERY);
            // criteria._id = clientId;
            // criteria.projects.deleted= SOFT_DELETE_FIND_QUERY;
            let query = {
                _id: clientId,
                "projects": {
                    $elemMatch: {
                        "deleted": { $exists: false }
                    }

                }
            }
            let result = await db.db().collection(collectionName).find(
                query).project({ projects: 1 })
                .toArray();
            return result;
        } catch (err) {
            throw err;
        }
    }
    // get ONE object from db
    static async getOne(clientId, projectId) {
        let criteria = { '_id': clientId }
        let projectionDoc =
            { 'projects': { $elemMatch: { '_id': projectId } } }

        let filesProjection = {
            _id: 1,
            originalname: 1,
            createdOn: 1
        }
        let filesCriteria = {
            foreignRef: projectId,
            moduleCode: "PROJECT"
        }

        try {
            let result = await DatabaseService.getOneFind(collectionName, criteria, projectionDoc)
            let fileResult = await DatabaseService.findByCriteria(Collection.DOCUMENT_UPLOAD, filesCriteria, filesProjection)

            if (result != undefined && result.projects.length > 0) {

                let project = result.projects[0]
                project.documents = fileResult

                return project;
            }
            else {
                return {}
            }

            // console.log("Result: ", await cursor.count());

        } catch (err) {
            throw err;
        }

    }
    // save object to db
    static async save(data) {
        const db = mongodb.getDB();
        try {
            let result = await db.db().collection(collectionName).updateOne({ _id: data.clientId },
                {
                    $push: { projects: buildInsertObject(data) }

                });
            result.insertedId = data._id;
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
    static async deleteOne(clientId, id) {
        try {
            //  let result = await DatabaseService.deleteOne(collectionName, id);
            const db = mongodb.getDB();
            // let result = await db.db().collection(collectionName).findOne(
            //     {
            //         _id: clientId,
            //         "projects": { "_id": projectId }
            //     }
            // );



            let result = await db.db().collection(collectionName).updateOne({ "_id": clientId, "projects._id": id }, {
                $set: {
                    "projects.$.deleted": true,
                    "projects.$.modifiedOn": new Date(),
                    "projects.$.modifiedBy": app.get('user')
                }
            });
            return result;
        } catch (err) {
            throw err;
        }
    }
    // need to be implemented
    static async getPagedData(clientId, pagination) {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).find(
                { _id: clientId }).project({ projects: 1 })
                .toArray();
            return result;
        } catch (err) {
            throw err;
        }
    }

    static async getProjectsWithoutClientId() {
        try{
            const db = mongodb.getDB();
            let data = await db.db().collection(collectionName).aggregate(
                [
                    {"$match":
                        {"deleted":{"$ne":true}}
                    },
                    {"$unwind":"$projects"},
                    {"$match":
                        {"projects.deleted":{"$ne":true}}
                    },
                    {"$project":
                        {
                            "_id":true,"name":true,"projects":true
                        }
                    }
                ]
            ).toArray();
            return data;
        } catch(err) {
            console.log(err);
            throw err;
        }
    }
}



