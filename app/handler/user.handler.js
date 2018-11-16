import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';
import { RolesHandler } from './roles.handler';

/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.USER;


export class UserHandler {
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
            //Adding permissions while saving user because user creation is one time process so it is optimized way while getting data of user
            data.permissions = [];
            let rolePermissions = [];
            for(let role of data.roles) {
                let permissions = await RolesHandler.getPermissionsByRoleName(role);
                for(let permission of permissions[0].permissions) {
                    rolePermissions.push(permission);
                }
            }
            data.permissions = rolePermissions;
            let result = await  DatabaseService.save(collectionName,data);
            
            return result.ops[0];
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    // update container
    static async updateOne(data) {
        try {
            data.permissions = [];
            let rolePermissions = [];
            for(let role of data.roles) {
                let permissions = await RolesHandler.getPermissionsByRoleName(role);
                for(let permission of permissions[0].permissions) {
                    rolePermissions.push(permission);
                }
            }
            data.permissions = rolePermissions;
            let result =  await DatabaseService.updateOne(collectionName,data);
            return result;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    // Delete One container
    static async deleteOne(id) {
        try {
            let result = await DatabaseService.softDeleteOne(collectionName,id);
            return result;
        } catch (err) {
            throw err;
        }
    }
}



