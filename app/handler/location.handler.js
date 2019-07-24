import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';
import { LocationTypeHandler } from "./location-type.handler";
import mongodb from "./../db/mongodb";
import ApplicationError from '../model/application-error';
import { SUBLEVEL_EXITS } from "../constants";


/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.LOCATION_NODES;


export class LocationHandler {
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
        let locationType = data.type;
        try {
            // before saving find counter

            let dbLocType = await DatabaseService.getOne(Collection.LOCATION_TYPE, locationType._id);
            // increment it 
            let incrementedValue = dbLocType.lastUsedValue + 1;
            dbLocType.lastUsedValue= incrementedValue;
            // update incremeneted value
            let updateResult = await DatabaseService.updateOne(Collection.LOCATION_TYPE, dbLocType);

            data.identifier = dbLocType.alias + '-' + incrementedValue;
            //assign it and save


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
            let check1 = await LocationHandler.checkIsParentOfAnyItem(id);
            if (check1) {
                throw new ApplicationError(SUBLEVEL_EXITS, 400);
            }
            let result = await DatabaseService.deleteOne(collectionName, id);
            return result;
        } catch (err) {
            throw err;
        }
    }
    static async getExceptParentLocationTypeList(parentId) {
        try {
            let result;
            //get Location
            let parent = await DatabaseService.getOne(collectionName, parentId);


            // untill we find the root , backtrace the trees
            let notInList = [];
            notInList.push(parent.type._id);
            while (parent != undefined && parent != null && parent.parentId != undefined) {

                parent = await DatabaseService.getOne(collectionName, parent.parentId);
                notInList.push(parent.type._id);

            }
            // once notInList is populated fetch remaining locationTypeList;
            result = await LocationTypeHandler.getNotInList(notInList);

            return result;
        } catch (err) {
            throw err;
        }

    }


    static async checkIsParentOfAnyItem(parentId) {
        try {
            //get Location
            const db = mongodb.getDB();
            let listCount = await db.db().collection(collectionName).find({ "parentId": parentId }).count();

            return listCount > 0 ? true : false;


        } catch (err) {
            throw err;
        }

    }
    static async checkIsEmpty(parentId) {
        //i.e is no equipment has been assigned to it 
    }
}



