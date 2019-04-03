import * as Collection from '../db/collection-constants';
import {
    DatabaseService
} from "../db/database.service";
import mongodb from "../db/mongodb";
import {
    buildInsertObject, buildUpdateObject
} from "../db/user-audit";
import {
    SOFT_DELETE_FIND_QUERY
} from "../model/generic-queries";


/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.SHIPMENT;
const projectSampleCollection = Collection.PROJECT_SAMPLES;


export class ShipmentHandler {
    // get all items from collection
    //@ts-nocheck
    static async getAll() {
        let projection = {
            shipmentStatus: 1,
            referenceNo: 1,
            courier: 1,
            "receivedBy": 1,
            nosOfSamples: 1
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
        let projection = {}
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

        let query = [{
            "$match": {
                "shipmentId": id
            }
        },
        {
            "$lookup": {
                "from": "project",
                "localField": "project._id",
                "foreignField": "_id",
                "as": "project"
            }
        },
        {
            "$unwind": "$project"
        }
        ]

        try {
            let shipmentObj = {}
            let result = await DatabaseService.getOneFind(collectionName, criteria,
                projection)
            let fileResult = await DatabaseService.findByCriteria(Collection.DOCUMENT_UPLOAD, filesCriteria, filesProjection)
            let projectSamples = await DatabaseService.getAggregatedData(Collection.PROJECT_SAMPLES, query);
            if (result !== undefined) {
                shipmentObj = result
                shipmentObj.documents = fileResult
                shipmentObj.projectSamples = projectSamples;
            }
            return shipmentObj;
        } catch (err) {
            throw err;
        }

    }
    // save object to db
    static async save(data) {
        try {
            const projectSamples = data.projectSamples;
            // remove key
            delete data['projectSamples'];
            // save shipment
            let result = await DatabaseService.save(collectionName, data);
            let shipment = result.ops[0];
            // save projectSamples 
            let samplesResult = await ShipmentHandler.saveProjectSamples(projectSamples, shipment._id);
            return shipment;
        } catch (err) {
            throw err;
        }
    }
    // update shipment to do
    static async updateOne(data) {
        try {
            let criteria = {
                "_id": data._id
            }

            let modifiedFields = {
                "courier": data.courier,
                "projectIds": data.projectIds,
                "referenceNo": data.referenceNo,
                "receivedBy": data.receivedBy,
                "deliveredBy": data.deliveredBy,
                "shipmentStatus": data.shipmentStatus,
                "nosOfSamples": data.nosOfSamples
            }
            const projectSamples = data.projectSamples;
            // remove key
            let result = await DatabaseService.updateByCriteria(collectionName, criteria, modifiedFields);
            let samplesResult = await ShipmentHandler.updateProjectSamples(projectSamples);
            // update project samples pending

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
            shipmentStatus: 1,
            referenceNo: 1,
            courier: 1,
            "receivedBy": 1,
            nosOfSamples: 1,
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


    // save project-sample Relation
    static async saveProjectSamples(projectSamples, shipmentId) {
        try {
            // console.log('save ps', projectSamples )
            const db = mongodb.getDB();
            var bulk = await db.db().collection(projectSampleCollection).initializeUnorderedBulkOp();

            for (let row of projectSamples) {
                // set shipmentId as foreign key
                row.shipmentId = shipmentId;
                bulk.insert(buildInsertObject(row));
            }

            return bulk.execute();
        } catch (err) {
            throw err;
        }
    }
    static async updateProjectSamples(projectSamples) {
        try {
             console.log('save ps', projectSamples )
            const db = mongodb.getDB();
            var bulk = await db.db().collection(projectSampleCollection).initializeUnorderedBulkOp();

            for (let row of projectSamples) {
                bulk.find({_id: row._id}).update({$set: buildUpdateObject(row)});

                // bulk.update(buildUpdateObject(row));
            }

            return bulk.execute();
        } catch (err) {
            throw err;
        }
    }

}