import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';

import mongodb from "../db/mongodb";
import { SOFT_DELETE_FIND_QUERY } from "../model/generic-queries"
import { DocumentHandler } from "./document.handler";
/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.SHIPMENT;



export class ShipmentHandler {
    // get all items from collection
    //@ts-nocheck
    static async getAll() {
        let projection = {
            shipmentStatus: 1, referenceNo: 1, courier: 1, "receivedBy": 1, nosOfSamples: 1
        }
        try {
            let result = await DatabaseService.getAll(collectionName, projection);
            return result;
        } catch (err) {
            throw err;
        }

    }
    // get ONE object from db
    static async getOne(id) {
        let projection = {
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
            moduleCode: "SHIPMENT"
        }

        try {
            let result = await DatabaseService.getOneFind(collectionName, criteria,

                projection)
            let fileResult = await DatabaseService.findByCriteria(Collection.DOCUMENT_UPLOAD, filesCriteria, filesProjection)

            if (result !== undefined) {
                let shipmentObj = result
                shipmentObj.documents = fileResult
                return shipmentObj
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
            return result.ops[0];
        } catch (err) {
            throw err;
        }
    }
    // update shipment to do
    static async updateOne(data) {
        try {
            const db = mongodb.getDB();
            let criteria = { "_id": data._id }
            let modifiedFields = {
                "courier": data.courier,
                "projectIds": data.projectIds,
                "referenceNo": data.referenceNo,
                "receivedBy": data.receivedBy,
                "deliveredBy": data.deliveredBy,
                "shipmentStatus": data.shipmentStatus,
                "nosOfSamples": data.nosOfSamples
            }
            let result = await DatabaseService.updateByCriteria(collectionName, criteria, modifiedFields);


            return result;
        } catch (err) {
            throw err;
        }
    }
    // Delete One shipment
    static async deleteOne(id) {
        try {
            let result = await DatabaseService.softDeleteOne(collectionName, id);
            return result;
        } catch (err) {
            throw err;
        }
    }
    static async getPagedData(clientId, pagination) {
        let projection = {
            shipmentStatus: 1, referenceNo: 1, courier: 1, "receivedBy": 1, nosOfSamples: 1,
            clientId: 1
        }
        let criteria = Object.create(SOFT_DELETE_FIND_QUERY);
        criteria.clientId = clientId;
        try {
            if (pagination.searchText !== undefined) {
                //criteria.referenceNo = new RegExp(/^BD/)
                // {
                //     $regex:
                //         /^BD/
                // }
            }

            let result = await DatabaseService.getPageAggregate(collectionName, pagination, criteria, projection);
            return result;
        } catch (err) {
            throw err;
        }

    }
}



