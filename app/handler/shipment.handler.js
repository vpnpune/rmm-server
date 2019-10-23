import * as Collection from "../db/collection-constants";
import { DatabaseService } from "../db/database.service";
import mongodb from "../db/mongodb";
import { buildInsertObject, buildUpdateObject } from "../db/user-audit";
import { SOFT_DELETE_FIND_QUERY } from "../model/generic-queries";
import { SampleHandler } from "./sample.handler";
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
      receivedBy: 1,
      nosOfSamples: 1
    };
    try {
      let result = await DatabaseService.getAll(collectionName, projection);
      return result;
    } catch (err) {
      throw err;
    }
  }
  // get ONE object from db
  static async getOne(id) {
    let criteria = Object.create(SOFT_DELETE_FIND_QUERY);
    criteria._id = id;
    let filesProjection = {
      _id: 1,
      originalname: 1,
      createdOn: 1
    };
    let filesCriteria = {
      foreignRef: id,
      moduleCode: "SHIPMENT"
    };

    let query = [
      {
        $match: {
          shipmentId: id
        }
      },
      {
        $lookup: {
          from: "project",
          localField: "project._id",
          foreignField: "_id",
          as: "project"
        }
      },
      {
        $unwind: "$project"
      }
    ];
    console.debug("neeraj");
    try {
      let shipmentObj = {};
      // let result = await DatabaseService.getOneFind(collectionName, criteria,
      //     projection)
      const db = mongodb.getDB();
      let result = await db
        .db()
        .collection(collectionName)
        .aggregate([
          {
            $match: criteria
          },
          {
            $lookup: {
              from: "user",
              localField: "receivedById",
              foreignField: "_id",
              as: "receivedBy"
            }
          },
          { $unwind: "$receivedBy" }
        ])
        .toArray();

      console.debug(result);

      let fileResult = await DatabaseService.findByCriteria(
        Collection.DOCUMENT_UPLOAD,
        filesCriteria,
        filesProjection
      );
      let projectSamples = await DatabaseService.getAggregatedData(
        Collection.PROJECT_SAMPLES,
        query
      );
      if (result !== undefined) {
        shipmentObj = result[0];
        shipmentObj.documents = fileResult;
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
      delete data["projectSamples"];
      // save shipment
      let result = await DatabaseService.save(collectionName, data);
      let shipment = result.ops[0];
      // save projectSamples
      let samplesResult = await ShipmentHandler.saveProjectSamples(
        projectSamples,
        shipment._id
      );
      return shipment;
    } catch (err) {
      throw err;
    }
  }
  // update shipment to do
  static async updateOne(data) {
    try {
      let criteria = {
        _id: data._id
      };

      let modifiedFields = {
        courier: data.courier,
        projectIds: data.projectIds,
        referenceNo: data.referenceNo,
        receivedBy: data.receivedBy,
        deliveredBy: data.deliveredBy,
        shipmentStatus: data.shipmentStatus,
        nosOfSamples: data.nosOfSamples
      };
      const projectSamples = data.projectSamples;
      // remove key
      let result = await DatabaseService.updateByCriteria(
        collectionName,
        criteria,
        modifiedFields
      );
      // for project Samples which have status 'SAMPLE_ADDED' // LEAVE it
      let deleteIds = [];
      let insertProjectSamples = [];
      for (let row of projectSamples) {
        if (row.status !== "SAMPLE ADDED") {
          if (row._id) {
            deleteIds.push(row._id);
          }
          // insert such //take status back to 0
          row.status = "SAMPLE ADDITION PENDING";
          insertProjectSamples.push(row);
        }
      }
      console.log("deleteIds");

      console.log(deleteIds);
      console.log("insertProjectSamples");

      console.log(insertProjectSamples);

      if (deleteIds.length > 0) {
        let r = await ShipmentHandler.deleteProjectSamples(deleteIds);
        console.log("result");
        console.log(r);
      }
      // insert ProjectSamples
      if (insertProjectSamples.length > 0) {
        await ShipmentHandler.saveProjectSamples(
          insertProjectSamples,
          data._id
        );
      }
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
      receivedBy: 1,
      clientId: 1
    };
    let criteria = Object.create(SOFT_DELETE_FIND_QUERY);
    criteria.clientId = clientId;

    try {
      const db = mongodb.getDB();
      let result = await db
        .db()
        .collection(collectionName)
        .aggregate([
          {
            $facet: {
              totalData: [
                {
                  $match: criteria
                },
                {
                  $lookup: {
                    from: "user",
                    localField: "receivedById",
                    foreignField: "_id",
                    as: "receivedBy"
                  }
                },
                { $unwind: "$receivedBy" },

                {
                  $project: projection
                },
                {
                  $skip: parseInt(pagination.start)
                },
                {
                  $limit: parseInt(pagination.end)
                }
              ],
              totalCount: [
                {
                  $match: criteria
                },
                {
                  $count: "count"
                }
              ]
            }
          }
        ])
        .toArray();
      if (result && result.length > 0 && result[0].totalCount[0]) {
        pagination.resultSet = result[0].totalData;
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

  // save project-sample Relation
  static async saveProjectSamples(projectSamples, shipmentId) {
    try {
      const db = mongodb.getDB();
      var bulk = await db
        .db()
        .collection(projectSampleCollection)
        .initializeUnorderedBulkOp();

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
      const db = mongodb.getDB();
      var bulk = await db
        .db()
        .collection(projectSampleCollection)
        .initializeUnorderedBulkOp();

      for (let row of projectSamples) {
        bulk.find({ _id: row._id }).update({ $set: buildUpdateObject(row) });

        // bulk.update(buildUpdateObject(row));
      }

      return bulk.execute();
    } catch (err) {
      throw err;
    }
  }
  // Update project Sample Status with equipment and status
  static async updateProjectSampleDetails(key, sampleStatus, equipmentId) {
    try {
      let criteria = {
        _id: key
      };

      let modifiedFields = {
        status: sampleStatus,
        equipmentId: equipmentId
      };
      let result = await DatabaseService.updateByCriteria(
        Collection.PROJECT_SAMPLES,
        criteria,
        modifiedFields
      );
      return result;
    } catch (err) {
      throw err;
    }
  }
  // TO DO
  // 1. Save Samples in sample collection
  // 2. update project-sample relation
  static async saveSamples(data) {
    console.log(data);
    const sampleArray = data.samples;
    try {
      // throw err;

      await SampleHandler.saveSamples(sampleArray);
      let prSamplesResult = await ShipmentHandler.updateProjectSampleDetails(
        data.projectSampleId,
        data.status,
        data.equipment._id
      );
      return prSamplesResult;
    } catch (err) {
      throw err;
    }
  }
  static async deleteProjectSamples(deleteIds) {
    let criteria = {
      _id: {
        $in: deleteIds
      }
    };
    try {
      let prSamplesResult = await DatabaseService.deleteMany(
        projectSampleCollection,
        criteria
      );
      // delete Samples
      let samplesCriteria = {
        projectSampleId: {
          $in: deleteIds
        }
      };
      await SampleHandler.deleteSamples(samplesCriteria);
      return prSamplesResult;
    } catch (err) {
      throw err;
    }
  }
}
