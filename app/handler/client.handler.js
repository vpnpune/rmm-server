import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';

import mongodb from "../db/mongodb";
import { SOFT_DELETE_FIND_QUERY } from "../model/generic-queries"
import { DocumentHandler } from "./document.handler";
/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.CLIENT;



export class ClientHandler {

    static async getClientList(userName) {
        try {
            return await DatabaseService.getAll(collectionName);
        } catch (err) {
            throw err;
        }

    }

    // get all items from collection
    //@ts-nocheck
    static async getAll(userName) {
        let projection = {
            aliases: 1, contactPersons: 1, name: 1, "clientAddress.state.name": 1,
            "clientAddress.country.name": 1
        }
        try {
            const db = mongodb.getDB();
            let aggregate = await db.db().collection(Collection.CLIENT_PROJECT_PERMISSION).aggregate(
                [
                    { "$match": { "userName": userName } },
                    { "$unwind": "$clients" },
                    { "$lookup": { "from": "client", "localField": "clients", "foreignField": "_id", "as": "data" } }]
            ).toArray();
            //let result = await DatabaseService.getAll(collectionName, projection);
            if (aggregate.length > 0) {

                return aggregate[0].data;
            } else {
                return [];
            }

        } catch (err) {
            throw err;
        }

    }
    // get ONE object from db
    static async getOne(id) {
        let projection = {
            aliases: 1, clientContact: 1, name: 1, clientAddress: 1, deleted: 1,
            contactPersons: 1, shipmentAddress: 1,

        }
        let criteria = Object.create(SOFT_DELETE_FIND_QUERY);
        criteria._id = id;
        let filesProjection = {
            _id: 1,
            originalname: 1,
            createdOn: 1
        }
        let filesCriteria = {
            foreignRef: id,
            moduleCode: "CLIENT"
        }

        try {

            let result = await DatabaseService.getOneFind(collectionName, criteria,

                projection);

            let fileResult = await DatabaseService.findByCriteria(Collection.DOCUMENT_UPLOAD, filesCriteria, filesProjection)
            if (result) {

                let clientObj = result;
                clientObj.documents = fileResult
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
    static async getPagedData(userName, roles) {
        let clients = [];
        if(!roles.includes("SuperAdmin")){
            const db = mongodb.getDB();
            try {
                let result = await db.db().collection(Collection.CLIENT_PROJECT_PERMISSION).aggregate([
                    { "$match": { "userName": userName }},
                    { "$unwind":"$clients" },
                    { "$lookup": { 
                        "from": "client", 
                        "localField": "clients", 
                        "foreignField": "_id", 
                        "as": "client" 
                    }},
                    { "$match": { "client.$.deleted": { "$ne": true }}}
                ]).toArray();
                if(result.length > 0) {
                    for(let i=0; i< result.length;i++){
                        let data = result[i].client[0];
                        if(!clients.some(el => el._id === data._id)) {
                            clients.push(data);
                        }
                    }
                    return clients;
                }
                
            } catch (err) {
                throw err;
            }
        } else {
            return await DatabaseService.getAll(collectionName);
        }
        

    }

    static async getAllClients() {
        let projection = {
            aliases: 1, contactPersons: 1, name: 1, "clientAddress.state.name": 1,
            "clientAddress.country.name": 1
        }
        try {
            let result = await DatabaseService.getAll(collectionName, projection);
            return result;


        } catch (err) {
            throw err;
        }

    }
}



