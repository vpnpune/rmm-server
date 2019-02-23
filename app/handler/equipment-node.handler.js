import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';
import { CounterService } from "../db/counter-service";
/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.EQUIPMENT_STORAGE_NODES;


export class EquipmentNodeHandler {

    // get all object from db
    static async getNodesForEquipment(equipmentId) {
        let criteria = {
            "equipmentId": equipmentId
        }
        try {
            let result = await DatabaseService.findByCriteria(collectionName, criteria);
            return result;
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
            let result = await DatabaseService.deleteOne(collectionName, id);
            return result;
        } catch (err) {
            throw err;
        }
    }
}



