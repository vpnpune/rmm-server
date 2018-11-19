import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';

import mongodb from "../db/mongodb";
import { SOFT_DELETE_FIND_QUERY } from "../model/generic-queries"
import { DocumentHandler } from "./document.handler";
/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.CLIENT;



export class ClientHandler {
    // get all items from collection
    //@ts-nocheck
    static async getAll() {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).find(
                { deleted: false }).project({ aliases: 1, clientContact: 1, name: 1, clientAddress: 1 })
                .toArray();

            //   let result = await DatabaseService.getAll(collectionName);
            return result;
        } catch (err) {
            throw err;
        }

    }
    // get ONE object from db
    static async getOne(id) {
        let projection = {
            aliases: 1, clientContact: 1, name: 1, clientAddress: 1, deleted: 1,
            contactPersons: 1, shipmentAddress: 1,
            numberOfProjects:
                { $size: { "$ifNull": ["$projects", []] } }
        }
        let criteria = SOFT_DELETE_FIND_QUERY;
        criteria._id = id;
        let filesProjection = {
            _id: 1,
            originalname: 1,
            createdOn:1
        }
        let filesCriteria = {
            foreignRef: id,
            moduleCode: "CLIENT"
        }

        try {

            let result = await DatabaseService.getOneAggregation(collectionName, criteria,

                projection)
            let fileResult = await DatabaseService.findByCriteria(Collection.DOCUMENT_UPLOAD,filesCriteria, filesProjection)
            if (result !== undefined && result.length > 0) {

                let clientObj = result[0]
                clientObj.documents=fileResult
                return clientObj
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
            return result;
        } catch (err) {
            throw err;
        }
    }
    // update container
    static async updateOne(data) {
        try {
            const db = mongodb.getDB();
            let criteria = { "_id": data._id }
            let modifiedFields = {
                "clientContact": data.clientContact,
                "name": data.name,
                "clientAddress": data.clientAddress,
                "aliases": data.aliases,
                "contactPersons": data.contactPersons

            }
            let result = await DatabaseService.updateByCriteria(collectionName, criteria, modifiedFields);


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
    static async getPagedData(pagination) {

        let projection = {
            aliases: 1, clientContact: 1, name: 1, clientAddress: 1, deleted: 1, numberOfProjects:
                { $size: { "$ifNull": ["$projects", []] } }
        }
        try {
            if (pagination.searchText != undefined) {

            }
            pagination = await DatabaseService.getPagedDataWithAggregationAndProjection(collectionName, pagination, SOFT_DELETE_FIND_QUERY, projection);


            //@Todo : Working code need to revert if component if else works on client side
            //if(parseInt(pagination.start)===0){
            //pagination.totalSize = await db.db().collection(collectionName).find({}).count();
            return pagination;
        } catch (err) {
            throw err;
        }

    }
}



