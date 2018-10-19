import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';

import mongodb from "../db/mongodb";

/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.CLIENT;


export class ClientHandler {
    // get all items from collection
    static async getAll() {
        try {
            const db = mongodb.getDB();
            let result = await db.db().collection(collectionName).find(
                {}).project({ aliases: 1, clientContact: 1, name: 1, clientAddress: 1, projects: 0 })
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

            let result = await DatabaseService.getOne(collectionName, id);
            return result;
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
    static async getPagedData(pagination) {
        try {
            //pagination = await DatabaseService.getPageData(collectionName, pagination);

            const db = mongodb.getDB();
            if (pagination.searchText != undefined) {

            }
            pagination.resultSet = await db.db().collection(collectionName).aggregate(
                {}).project({ aliases: 1, clientContact: 1, name: 1, clientAddress: 1, numberOfProjects: { $size: "$projects" } }).limit(parseInt(pagination.end)).skip(parseInt(pagination.start)).toArray();


            //@Todo : Working code need to revert if component if else works on client side
            //if(parseInt(pagination.start)===0){
            //pagination.totalSize = await db.db().collection(collectionName).find({}).count();

            return pagination;
        } catch (err) {
            throw err;
        }

    }
}



