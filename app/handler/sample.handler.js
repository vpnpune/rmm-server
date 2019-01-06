import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';
import { buildInsertObject, buildUpdateObject, addCreationDetails } from "../db/user-audit";
import mongodb from "../db/mongodb";

import logger from '../logger';
const log = logger.Logger;
import app from '../server'
import { SOFT_DELETE_FIND_QUERY } from "../model/generic-queries";


/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.SAMPLES;




// need to test
export class SampleHandler {

    // save object to db
    static async save(data) {
        const db = mongodb.getDB();
        try {
            let result = await DatabaseService.save(collectionName, data);
            return result;
        } catch (err) {
            throw err;
        }
    }
    // get ONE object from db
    static async getOne(projectId) {

        let criteria = Object.create(SOFT_DELETE_FIND_QUERY);
        criteria._id = projectId;
        let projectionDoc =
            {}

        let filesProjection = {
            _id: 1,
            originalname: 1,
            createdOn: 1
        }
        let filesCriteria = {
            foreignRef: projectId,
            moduleCode: "SAMPLE"
        }

        try {
            let result = await DatabaseService.getOneFind(collectionName, criteria, projectionDoc)
            let fileResult = await DatabaseService.findByCriteria(Collection.DOCUMENT_UPLOAD, filesCriteria, filesProjection)

            if (result) {

                let project = result
                project.documents = fileResult
                return project;
            }
            else {
                return {}
            }
        } catch (err) {
            throw err;
        }

    }
    // update container
    static async updateOne(data) {

        let criteria = { "_id": data._id }
        let modifiedFields = {
            "closed": data.closed,
            "name": data.name,
            "clientProjectManager": data.clientProjectManager,
            "operationProjectManager": data.operationProjectManager,
            "sampleDefinition": data.sampleDefinition ? data.sampleDefinition : undefined
        }
        try {
            const db = mongodb.getDB();
            let result = await DatabaseService.updateByCriteria(collectionName, criteria, modifiedFields);
            return result;
        } catch (err) {
            throw err;
        }
    }

    // get all items from collection
    static async getAll() {
        let projection = {}
        try {
            let result = await DatabaseService.getAll(collectionName, projection);

            return result;
        } catch (err) {
            throw err;
        }
    }


    // Delete One container
    static async deleteOne(id) {
        try {
            const db = mongodb.getDB();

            let result = await DatabaseService.softDeleteOne(collectionName, id);


            // let result = await db.db().collection(collectionName).updateOne({ "_id": clientId, "projects._id": id }, {
            //     $set: {
            //         "projects.$.deleted": true,
            //         "projects.$.modifiedOn": new Date(),
            //         "projects.$.modifiedBy": app.get('user')
            //     }
            // });
            return result;
        } catch (err) {
            throw err;
        }
    }
    // need to be implemented
    static async getPagedData(pagination, clientId = null) {
        let projection = {
            closed: 1, name: 1, clientProjectManager: 1, operationProjectManager: 1
        }
        let criteria = Object.create(SOFT_DELETE_FIND_QUERY);
        if (clientId)
            criteria.clientId = clientId

        if (pagination.queryParams) {
            // iterate other parameters and create query
        }

        //criteria.clientId = clientId;
        try {
            if (pagination.searchText !== undefined) {
            }

            let result = await DatabaseService.getPageAggregate(collectionName, pagination, criteria, projection);
            return result;
        } catch (err) {
            throw err;
        }

    }

    static async getAllWithCriteria(clientId) {
        let criteria = {}
        criteria.clientId = clientId;

        let projection = {
            "closed": 1,
            "name": 1,
            "clientProjectManager": 1,
            "operationProjectManager": 1
        }
        try {
            console.log(criteria)
            let result = await DatabaseService.findByCriteria(collectionName, criteria, projection)
            console.log(result)
            return result;
        } catch (err) {
            throw err;
        }
    }


    static async getProjectsWithoutClientId() {
        try {
            const db = mongodb.getDB();
            let data = await db.db().collection(collectionName).aggregate(
                [
                    {
                        "$match":
                            { "deleted": { "$ne": true } }
                    },
                    { "$unwind": "$projects" },
                    {
                        "$match":
                            { "projects.deleted": { "$ne": true } }
                    },
                    {
                        "$project":
                        {
                            "_id": true, "name": true, "projects": true
                        }
                    }
                ]
            ).toArray();
            return data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}



