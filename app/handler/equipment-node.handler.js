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
        let result;
        try {
            if (data['client']) {

                delete data['client'];
            }
            delete data['children'];

            result = await DatabaseService.save(collectionName, data);
            // console.log(result);
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
                let reservedNodes = EquipmentNodeHandler.isReservationPossible(data, data.reserved);
                if (reservedNodes && reservedNodes.length > 0) {
                    throw new ApplicationError(reservedNodes[0] + " is reserved by other client", 500);
                }
                // this means node and subsequent nodes can be reserved 
                let nodesToUpdate = [];
                nodesToUpdate = EquipmentNodeHandler.getAllChildNodes(data, nodesToUpdate);
                // console.log(nodesToUpdate);
                let modifiedFields = {
                    "reserved": data.reserved,

                }
                criteria =
                    { "_id": { $in: nodesToUpdate } }

                result = await DatabaseService.updateByCriteria(collectionName, criteria, modifiedFields);
                data['client'] = undefined;
                data['children'] = undefined;
                result = await DatabaseService.updateOne(collectionName, data);

                // console.log(result);
            }
            // if removing nodes from reservation  
            else {
                data.reserved = undefined;
                data['client'] = undefined;
                data['children'] = undefined;
                result = await DatabaseService.updateOne(collectionName, data);

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

    static isReservationPossible(node, clientId) {
        let m = [];
        m = EquipmentNodeHandler.checkNonFreeNodes(node, m, clientId);

        return m;
    }
    static checkNonFreeNodes(node, m, clientId) {
        console.log('checkNonFreeNodes')

        if (EquipmentNodeHandler.isNodeReserved(node, clientId)) {
            m.push(node.name);
            return m;
        }
        if (node.children && node.children.length > 0) {
            for (let i = 0; i < node.children.length; i++) {
                EquipmentNodeHandler.checkNonFreeNodes(node.children[i], m, clientId);
            }
        }
        return m;
    }
    //is Node free 
    static isNodeReserved(node, clientId) {
        return node.reserved && node.reserved.length > 0 && node.reserved !== clientId;
    }
    static getAllChildNodes(node, m) {
        m.push(node._id);
        if (node.children && node.children.length > 0) {
            for (let i = 0; i < node.children.length; i++) {
                EquipmentNodeHandler.getAllChildNodes(node.children[i], m);
            }
        }
        return m;
    }
}



