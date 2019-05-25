import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';
import { PermissionsHandler } from "./permissions.handler";
import mongodb from "../db/mongodb";

/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.ROLES;


export class RolesHandler {
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
            let result = await  DatabaseService.getOne(collectionName,id);
            return result;
        } catch (err) {
            throw err;
        }

    }
    // save object to db
    static async save(data) {
        try {
            data._id = data.roleName;
            let permissions = data.permissions;
            let permissionArr = [];
            for(let permission of permissions) {
                let  permissionObj = await PermissionsHandler.getOne(permission);
                permissionArr.push(permissionObj._id);
            }
            data.permissions = permissionArr;
            let result = await DatabaseService.saveWithoutAutoId(collectionName,data);
            return result.ops[0];
        } catch (err) {
            throw err;
        }
    }
    // update container
    static async updateOne(data) {
        try {
            let permissions = data.permissions;
            let permissionArr = [];
            for(let permission of permissions) {
                let  permissionObj = await PermissionsHandler.getOne(permission);
                permissionArr.push(permissionObj._id);
            }
            data.permissions = permissionArr;
            let result =  await DatabaseService.updateOne(collectionName,data);
            return result;
        } catch (err) {
            throw err;
        }
    }
    // Delete One container
    static async deleteOne(id) {
        try {
            const db = mongodb.getDB();
            let aggregate = await db.db().collection(Collection.USER).aggregate(
                [
                    {"$unwind":"$roles"},
                    {"$lookup":{"from":"roles","localField":"roles","foreignField":"roleName","as":"roles"}},
                    {"$unwind":"$roles"},
                    {"$match":{"roles._id":id}},
                    {"$count":"count"}
                ]).toArray();
            
            if(aggregate && aggregate.length > 0) {
                return Error("It is assigned to User(s), so unable to archieve.");
            } else {
                let result = await DatabaseService.deleteOne(collectionName,id);
                return result;
            }
            
        } catch (err) {
            throw err;
        }
    }

    static async getPermissionsByRoleName(roleName) {
         // get ONE object from db
        try {
            var regex = new RegExp(["^", roleName, "$"].join(""), "i");
            let criteria = {"roleName": regex}
            let result = await  DatabaseService.findByCriteria(collectionName,criteria);
            return result;
        } catch (err) {
            throw err;
        }

    }
}



