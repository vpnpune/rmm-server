import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';

import mongodb from "../db/mongodb";

/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.CLIENT;


export class ClientHandler {
    // get all items from collection
    //@ts-nocheck
    static async getAll() {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).find(
                { deleted: false }).project({ aliases: 1, clientContact: 1, name: 1, clientAddress: 1, projects: 0 })
                .toArray();

            //   let result = await DatabaseService.getAll(collectionName);
            return result;
        } catch (err) {
            throw err;
        }

    }
    // get ONE object from db
    static async getOne(id) {
        try {
            const db = mongodb.getDB();
            console.log(id)
            let result = await db.db().collection(collectionName).aggregate(
                [{ $match: { "_id": id } }]).
                project(
                    {
                        aliases: 1, clientContact: 1, name: 1, clientAddress: 1, deleted: 1,
                        contactPersons: 1, shipmentAddress: 1,
                        numberOfProjects:
                            { $size: "$projects" }
                    }
                )
                .toArray();


            if (result !== undefined && result.length > 0)
                return result[0];
            else
                return {};
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

            let result = await db.db().collection(collectionName).updateOne({ "_id": id }, {
                $set: {
                    "clientContact": data.clientContact,
                    "name": data.name,
                    "clientAddress": data.clientAddress,
                    "aliases": data.aliases,
                    "contactPersons": data.contactPersons,
                    "modifiedBy": data.modifiedBy,
                    "modifiedOn": new Date()

                }
            });
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
        try {
            //pagination = await DatabaseService.getPageData(collectionName, pagination);

            const db = mongodb.getDB();
            if (pagination.searchText != undefined) {

            }
            pagination.resultSet = await db.db().collection(collectionName).aggregate(

                [{ $match: { $or: [{ "deleted": { $exists: true, $eq: false } }, { "deleted": { $exists: false } }] } }]

            ).project(
                {
                    aliases: 1, clientContact: 1, name: 1, clientAddress: 1, deleted: 1, numberOfProjects:
                        { $size: "$projects" }
                }
            ).limit(parseInt(pagination.end)).skip(parseInt(pagination.start)).toArray();


            //@Todo : Working code need to revert if component if else works on client side
            //if(parseInt(pagination.start)===0){
            //pagination.totalSize = await db.db().collection(collectionName).find({}).count();

            return pagination;
        } catch (err) {
            throw err;
        }

    }
}



