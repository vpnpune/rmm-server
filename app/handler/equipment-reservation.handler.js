import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';

import mongodb from "../db/mongodb";

import logger from '../logger';
const log = logger.Logger;
import { SOFT_DELETE_FIND_QUERY } from "../model/generic-queries";


/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.EQUIPMENT_CLIENT;




// need to test
export class EquipmentReservationHandler {

    // save object to db
    static async save(data) {
        try {

            let result = await DatabaseService.bulkUpsert(collectionName, data);
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



        try {
            let result = await DatabaseService.getOneFind(collectionName, criteria, projectionDoc)

            return result;

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
            let result = await DatabaseService.findByCriteria(collectionName, criteria, projection)
            return result;
        } catch (err) {
            throw err;
        }
    }



}



