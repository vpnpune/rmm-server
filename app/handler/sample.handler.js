import * as Collection from "../db/collection-constants";
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

  // get all items from collection
  static async getSamples(id) {
    let criteria = Object.create(SOFT_DELETE_FIND_QUERY);
    criteria["projectSampleId"] = id;
    console.log(criteria);
    try {
      let result = await DatabaseService.findByCriteria(
        collectionName,
        criteria
      );
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
    console.debug("Saving Samples")
    const projectSample = data.projectSample;
    const units = data.units;
    try {
      // Step 1 : Fetch Samples Array of Project Samples

      let dbSamples = await SampleHandler.getSamples(projectSample._id);
      // Step 2 : group samples array on basis of container Type
      const samplesGrouped = SampleHandler.groupByContainer(dbSamples);
      // Step 4 : For Each separated array update samples with
      let index = 0;
      for (const s of samplesGrouped) {
        let containerId = s[0];
        console.log(containerId);
        let contSamples = s[1];
        // console.log(contSamples);
        // a: Get Container from DB;
        let contDB = await ContainerHandler.getOne(containerId);
        let lastUsedValue = contDB.lastUsedValue;
        // Step 4 : For Each separated array update samples with

        contSamples.forEach(sampleUnit => {
          // b: increment lastValue and create container ID in sample
          sampleUnit.containerId = `${contDB.prefix}-${++lastUsedValue}`;
          sampleUnit.containerType = contDB.containerName;
          sampleUnit.expired = false;
          let unit = units[index++];
          // ______ a: allocated status // temp commented
          sampleUnit.allocated = ++(unit.allocated) ;
          // ______ d: storage location Object
          sampleUnit.location = unit;
          //c : modify unit too.
          unit.sampleId = sampleUnit._id;
          contDB.lastUsedValue = lastUsedValue;
        });
        // Step 5 : Push updated Samples array to Samples Collection

        console.log("contSamples");
        console.log(contSamples);
        await SampleHandler.updateBoxUnits(contSamples, collectionName);

        // Step 6 : update container obj to collection to persist last value
        console.log("containerValue");
        console.log(contDB);
        await ContainerHandler.updateOne(contDB);

        // Step 7 -- Update Units
        console.log(units);
        await SampleHandler.updateBoxUnits(units, boxUnitCollection);
      } // for-loop

      // Step 8 : Update project Samples for status purpose

      console.log("project Sample");
      console.log(projectSample);
      let psResult = await ShipmentHandler.updateProjectSampleDetails(
        projectSample._id,
        projectSample.status,
        projectSample.equipmentId
      );

    
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
    criteria["boxId"] = id;
    try {
      let result = await DatabaseService.findByCriteria(
        boxUnitCollection,
        criteria
      );
      return result;
    } catch (err) {
      throw err;
    }
  }
  // save samples to samples collection
  static async saveSamples(data) {
    try {
      const db = mongodb.getDB();
      var bulk = await db
        .db()
        .collection(collectionName)
        .initializeUnorderedBulkOp();

      for (let row of data) {
        bulk.insert(buildInsertObject(row));
      }

      return bulk.execute();
    } catch (err) {
      throw err;
    }
  }
  // generic method
  static async updateBoxUnits(data, collectionName) {
    try {
      const db = mongodb.getDB();
      var bulk = await db
        .db()
        .collection(collectionName)
        .initializeUnorderedBulkOp();

      for (let row of data) {
        bulk.find({ _id: row._id }).update({ $set: buildUpdateObject(row) });
      }

      return bulk.execute();
    } catch (err) {
      throw err;
    }
  }

  // private methods
  static groupByContainer(list) {
    const grouped = this.groupBy(list, sample => sample.containerType._id);
    return grouped;
  }
  static groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach(item => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }
}
