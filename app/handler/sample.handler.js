import * as Collection from '../db/collection-constants';
import { DatabaseService } from "../db/database.service";
import mongodb from "../db/mongodb";
import { buildInsertObject, buildUpdateObject } from "../db/user-audit";
import { SOFT_DELETE_FIND_QUERY } from "../model/generic-queries";
import { ContainerHandler } from "./container.handler";
import { ShipmentHandler } from "./shipment.handler";
/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.SAMPLES;
const boxUnitCollection = Collection.BOX_UNITS;


export class SampleHandler {

    // get all items from collection
    static async getAll() {
        try {
            let result = await DatabaseService.getAll(collectionName);
            return result;
        } catch (err) {
            throw err;
        }

    }

    // get ONE object from db
    static async getOne(id) {
        try {
            let result = await DatabaseService.getOne(collectionName, id);
            return result;
        } catch (err) {
            throw err;
        }

    }

    // save object to db
    static async save(data) {

        const projectSample = data.projectSample;
        const sampleDetails = projectSample.sampleDetails;
        const container = sampleDetails.containerType
        const units = data.units;
        // console.log('projectSample', projectSample);
        // console.log('sampleDetails', sampleDetails);
        // console.log('container', container);
        // console.log('units', units);
        let lastUsedValue = container.lastUsedValue;
        console.log('lastUsedValue', lastUsedValue)
        let sampleUnits = [];
        units.forEach(element => {
            let sampleUnit = {};
            sampleUnit.allocated = ++element.allocated;
            sampleUnit.containerType = container.containerName;
            sampleUnit.containerId = `${container.prefix}-${++lastUsedValue}`;
            sampleUnit.expired = false;
            sampleUnit.projectSampleId = projectSample._id
            sampleUnit.unitId = element._id;
            sampleUnit.row = element.row;
            sampleUnit.col = element.col;
            sampleUnit.boxId = element.boxId;

            sampleUnits.push(sampleUnit);
            // mark box unit as allocated
            element.allocated = 2
            // console.log(element);
        });
        try {
            // 1. Save Samples
            let sampleResult = await SampleHandler.saveSamples(sampleUnits);
            container.lastUsedValue = lastUsedValue;

            let containerResult = await ContainerHandler.updateOne(container);
            let unitsResult = await SampleHandler.updateBoxUnits(units);
            projectSample.sampleDetails.containerType = container;
            let psResult = await ShipmentHandler.updateProjectSampleDetails(projectSample);

            return psResult;
        } catch (err) {
            throw err;
        }
    }

    // update container
    static async updateOne(data) {
        try {
            let result = await DatabaseService.updateOne(collectionName, data);
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

    // services related to boxUnits
    // get all items from collection
    static async getAllActiveBoxUnits(id) {
        let criteria = Object.create(SOFT_DELETE_FIND_QUERY);
        criteria["boxId"] = id
        console.log(criteria)
        try {
            let result = await DatabaseService.findByCriteria(boxUnitCollection, criteria);
            return result;
        } catch (err) {
            throw err;
        }

    }
    // save samples to samples collection 
    static async saveSamples(data) {
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

    static async updateBoxUnits(data) {
        try {
            const db = mongodb.getDB();
            var bulk = await db.db().collection(boxUnitCollection).initializeUnorderedBulkOp();

            for (let row of data) {
                bulk.find({ _id: row._id }).update({ $set: buildUpdateObject(row) });
            }

            return bulk.execute();
        } catch (err) {
            throw err;
        }

    }



}




