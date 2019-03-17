import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';
import { CounterService } from "../db/counter-service";
import mongodb from "./../db/mongodb";
import ApplicationError from "../model/application-error";

/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.EQUIPMENT_STORAGE_NODES;


export class EquipmentNodeHandler {

    // get all object from db
    static async getNodesForEquipment(equipmentId) {
        let criteria = {
            "equipmentId": equipmentId
        }
        const db = mongodb.getDB();
        try {
            // let result = await DatabaseService.findByCriteria(collectionName, criteria);

            let data = await db.db().collection(collectionName).aggregate([{ "$match": criteria },
            { $lookup: { "from": "client", "localField": "reserved", "foreignField": "_id", "as": "client" } }
            ]).toArray();
            return data;

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
    // update container
    static async updateOne(data) {
        let result;
        let criteria;
        try {
            if (data.reserved) {



                let reserveFlag = await EquipmentNodeHandler.isReservationPossible(data);



                if (reserveFlag) {
                    // if root node then just update all the nodes with same client 
                    console.log(data);
                    if (data.nodeType === parseInt(0)) {
                        let modifiedFields = {
                            "reserved": data.reserved,
                            "client": undefined
                        }
                        criteria = {
                            "equipmentId": data.equipmentId
                        }
                        result = await DatabaseService.updateByCriteria(collectionName, criteria, modifiedFields);
                    }
                    else {
                        console.log('else ');
                        result = await DatabaseService.updateOne(collectionName, data);
                    }
                }
            } else {
                console.log('no reservation');
                let unset = {
                    'reserved': '',
                    'client': []
                }

                result = await DatabaseService.updateOne(collectionName, data,unset);

            }
            return result;
        } catch (err) {
            throw err;
        }
    }
    // Delete One container
    static async deleteOne(id) {
        try {
            let result = await DatabaseService.deleteOne(collectionName, id);
            return result;
        } catch (err) {
            throw err;
        }
    }

    static async isReservationPossible(node) {
        const db = mongodb.getDB();
        console.log('called');
        let criteria = { $or: [{ "reserved": { $exists: true, $ne: node.reserved } }], "equipmentId": node.equipmentId }
        let flag = true;

        try {
            // if (rootNode) check only any another client reserved node is present
            if (node.nodeType === parseInt(0)) {
                let data = await db.db().collection(collectionName).find(criteria).count();
                console.log(data);
                if (data > 0) {
                    flag = false;
                    throw new ApplicationError("Already nodes under this level are reserved for another client", 400);
                }

            }

            //let result = await DatabaseService.save(collectionName, data);
            return flag;
        } catch (err) {
            throw err;
        }
    }
}



