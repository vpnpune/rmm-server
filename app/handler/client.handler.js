import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';

import mongodb from "../db/mongodb";
import { SOFT_DELETE_FIND_QUERY } from "../model/generic-queries"
import { DocumentHandler } from "./document.handler";
/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.CLIENT;



export class ClientHandler {
    // get all items from collection
    //@ts-nocheck
    static async getAll(userName) {
        let projection = {
            aliases: 1, contactPersons: 1, name: 1, "clientAddress.state.name": 1,
            "clientAddress.country.name": 1
        }
        try {
            const db = mongodb.getDB();
            let aggregate = await db.db().collection(Collection.CLIENT_PROJECT_PERMISSION).aggregate(
                [
                    { "$match": { "userName": userName } },
                    { "$unwind": "$clients" },
                    { "$lookup": { "from": "client", "localField": "clients", "foreignField": "_id", "as": "data" } }]
            ).toArray();
            //let result = await DatabaseService.getAll(collectionName, projection);
            console.log('aggregate: ', aggregate);
            if (aggregate.length > 0) {

                return aggregate[0].data;
            } else {
                return [];
            }

        } catch (err) {
            throw err;
        }

    }
    // get ONE object from db
    static async getOne(id) {
        let projection = {
            aliases: 1, clientContact: 1, name: 1, clientAddress: 1, deleted: 1,
            contactPersons: 1, shipmentAddress: 1,

        }
        let criteria = Object.create(SOFT_DELETE_FIND_QUERY);
        criteria._id = id;
        let filesProjection = {
            _id: 1,
            originalname: 1,
            createdOn: 1
        }
        let filesCriteria = {
            foreignRef: id,
            moduleCode: "CLIENT"
        }

        try {

            let result = await DatabaseService.getOneFind(collectionName, criteria,

                projection);

            let fileResult = await DatabaseService.findByCriteria(Collection.DOCUMENT_UPLOAD, filesCriteria, filesProjection)
            if (result) {

                let clientObj = result;
                clientObj.documents = fileResult
                return clientObj
            }
            else {
                return {}
            }

        } catch (err) {
            throw err;
        }

    }
    // save object to db
    static async save(data) {
        try {
            let result = await DatabaseService.save(collectionName, data);
            return result;
        } catch (err) {
            throw err;
        }
    }
    // update container
    static async updateOne(data) {
        try {
            let criteria = { "_id": data._id }
            let modifiedFields = {
                "clientContact": data.clientContact,
                "name": data.name,
                "clientAddress": data.clientAddress,
                "aliases": data.aliases,
                "contactPersons": data.contactPersons

            }
            let result = await DatabaseService.updateByCriteria(collectionName, criteria, modifiedFields);


            return result;
        } catch (err) {
            throw err;
        }
    }
    // Delete One container
    static async deleteOne(id) {
        try {
            let result = await DatabaseService.softDeleteOne(collectionName, id);
            return result;
        } catch (err) {
            throw err;
        }
    }
    static async getPagedData(pagination) {
        const db = mongodb.getDB();

        try {
            if (pagination.searchText != undefined) {

            }
            let result = await db.db().collection(collectionName).aggregate([
                {
                    "$facet": {
                        "totalData": [
                            {
                                "$match":
                                    { "deleted": { "$ne": true } }
                            },
                            { "$lookup": { "from": "project", "localField": "_id", "foreignField": "clientId", "as": "project" } },
                            {
                                "$project":
                                {
                                    "_id": true, "name": true, "aliases": true, "clientContact": true, "clientAddress": true, "items": {
                                        "$filter":
                                            { "input": "$project", "as": "item", "cond": { "$ne": ["$$item.deleted", true] } }
                                    }
                                }
                            },
                            { "$project": { "_id": true, "name": true, "aliases": true, "clientContact": true, "clientAddress": true, "noOfProject": { "$size": "$items" } } },
                            { "$skip": parseInt(pagination.start) },
                            { "$limit": parseInt(pagination.end) }],
                        "totalCount": [
                            { "$match": { "deleted": { $ne: true } } },
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

    static async getAllClients() {
        let projection = {
            aliases: 1, contactPersons: 1, name: 1, "clientAddress.state.name": 1,
            "clientAddress.country.name": 1
        }
        try {
            let result = await DatabaseService.getAll(collectionName, projection);
            return result;


        } catch (err) {
            throw err;
        }

    }
}



