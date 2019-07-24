import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';
import { buildInsertObject, buildUpdateObject, addCreationDetails } from "../db/user-audit";
import mongodb from "../db/mongodb";

import logger from '../logger';
const log = logger.Logger;
import app from './../server'
import { SOFT_DELETE_FIND_QUERY } from "../model/generic-queries";


/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.PROJECT;




// need to test
export class ProjectHandler {

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
            moduleCode: "PROJECT"
        }

        try {
            // let result = await DatabaseService.getOneFind(collectionName, criteria, projectionDoc)

            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).aggregate(
                [{
                    $match: criteria
                },
                { "$lookup": { "from": "user", "localField": "operationProjectManager", "foreignField": "_id", "as": "opm" } },
                { "$unwind": "$opm" },

                ])
                .toArray();

            let fileResult = await DatabaseService.findByCriteria(Collection.DOCUMENT_UPLOAD, filesCriteria, filesProjection)

            if (result) {
                let project = result[0];
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
            return result;
        } catch (err) {
            throw err;
        }
    }
    // need to be implemented
    static async getPagedData(pagination, clientId = null) {
        let projection = {
            closed: 1, name: 1, clientProjectManager: 1, operationProjectManager: 1, opm: 1
        }
        let criteria = Object.create(SOFT_DELETE_FIND_QUERY);
        if (clientId)
            criteria.clientId = clientId

        if (pagination.queryParams) {
            // iterate other parameters and create query
        }
        // 
        //criteria.clientId = clientId;
        try {
            if (pagination.searchText !== undefined) {
            }


            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).aggregate([{
                "$facet": {
                    "totalData": [{
                        "$match": criteria
                    },
                    { "$lookup": { "from": "user", "localField": "operationProjectManager", "foreignField": "_id", "as": "opm" } },
                    { "$unwind": "$opm" },

                    {
                        "$project": projection
                    },
                    {
                        "$skip": parseInt(pagination.start)
                    },
                    {
                        "$limit": parseInt(pagination.end)
                    }
                    ],
                    "totalCount": [{
                        "$match": criteria
                    },
                    { "$lookup": { "from": "user", "localField": "operationProjectManager", "foreignField": "_id", "as": "opm" } },
                    {
                        "$count": "count"
                    }
                    ]
                }
            }]).toArray();
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
            let result = await DatabaseService.findByCriteria(collectionName, criteria, projection)
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
                    {
                        "$lookup": {
                            "from": "client",
                            "localField": "clientId",
                            "foreignField": "_id",
                            "as": "clientObj"
                        }
                    },
                    {
                        "$match":
                            { "clientObj.deleted": { "$ne": true } }
                    },
                    {
                        "$project":
                        {
                            "_id": true, "name": true, "clientObj._id": true, "clientObj.name": true
                        }
                    },
                    { "$unwind": "$clientObj" }
                ]
            ).toArray();
            return data;
        } catch (err) {
            throw err;
        }
    }

    static async getProjects(userName, roles, clientId) {
        try {
            if(!roles.includes("SuperAdmin")) {
                const db = mongodb.getDB();
                let data = await db.db().collection(Collection.CLIENT_PROJECT_PERMISSION).aggregate([
                    {"$match":{"userName":userName}},
                    {"$unwind":"$projects"},
                    {"$lookup":{
                        "from":"project",
                        "localField":"projects",
                        "foreignField":"_id",
                        "as":"project"
                    }},
                    {"$unwind":"$project"},
                    {"$match":{"project.clientId":clientId}},
                    {"$group":{
                        "_id":"$_id",
                        "projects":{"$addToSet":"$project"}
                    }}
                ]).toArray();
                return data[0].projects;
            } else {
                return await DatabaseService.findByCriteria(collectionName,{"clientId":clientId});
            }
        } catch (err) {
            throw err;
        }
    }

    
}



