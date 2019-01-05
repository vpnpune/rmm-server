import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';
import mongodb from "./../db/mongodb";
import { addCreationDetails } from "./../db/user-audit";

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
            data._id = data.userName;
            let result = await  DatabaseService.saveWithoutAutoId(collectionName,data);
            
            return result.ops[0];
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    // update container
    static async updateOne(data) {
        try {
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

    // get ONE object from db
    static async getUserByCredentials(userName, password) {
        try {
            let criteria = {
                $and:[
                    {"password": password},
                    {
                        $or:[
                            {"userName": userName},{"emailId": userName},{"_id":userName}
                        ]
                    }
                ]
            };
            let result = await  DatabaseService.findByCriteria(collectionName,criteria);
            return result[0];
        } catch (err) {
            throw err;
        }
    }

    // get ONE object from db
    static async getByUserName(userName) {
        try {
            let criteria = {
                $or:[
                    {"userName": userName},{"emailId": userName},{"_id":userName}
                ]
            };
            let result = await  DatabaseService.findByCriteria(collectionName,criteria);
            console.log("Data: ",result);
            return result[0];
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    static async getUserPermissions(userName,password) {
        try{
            const db = mongodb.getDB();
            let data = await db.db().collection(collectionName).aggregate(
                [ 
                    {"$match":{
                        "$and":[
                            {"password":password},
                            {"$or":[
                                {"userName":userName},
                                {"emailId":userName}
                            ]}
                        ]}
                    }, 
                    {"$unwind": "$roles"}, 
                    {"$lookup": 
                        { "from":"roles", "localField":"roles", "foreignField":"_id", "as":"roleObj" } 
                    }, 
                    {"$unwind":"$roleObj"}, 
                    {"$unwind":"$roleObj.permissions"},
                    {"$lookup":
                        {"from":"permission","localField":"roleObj.permissions","foreignField":"_id","as":"permissionObj"}
                    },
                    {"$unwind":"$permissionObj"},
		            {"$unwind":"$menus"},
		            {"$lookup":
                        {"from":"menu","localField":"menus","foreignField":"_id","as":"menuObj"}
                    },
                    {"$unwind":"$menuObj"},
		            {"$unwind":"$submenu"},
		            {"$lookup":
                        {"from":"submenu","localField":"submenu","foreignField":"_id","as":"submenuObj"}
                    },
                    {"$unwind":"$submenuObj"},
                    {"$group":
                        {
                            "_id":"$_id",
                            "firstName":{"$first":"$firstName"},
                            "lastName":{"$first":"$lastName"},
                            "emailId":{"$first":"$emailId"},
                            "mobileNumber":{"$first":"$mobileNumber"},
                            "createdBy":{"$first":"$createdBy"},
                            "createdOn":{"$first":"$createdOn"},
                            "userName":{"$first":"$userName"},
                            "roles":{"$addToSet":"$roles"},
                            "permissions":{"$addToSet":"$permissionObj"},
			                "menus":{"$addToSet":"$menuObj"},
                            "submenus":{"$addToSet":"$submenuObj"}
                        }
                    }  
                ]).toArray();
            if(data && data.length > 0) {
                let result = data[0];
                let menus = result.menus;
                let submenus = result.submenus;

                for(let menu of menus) {
                    let subMenuArr = [];
                    for(let submenu of submenus) {
                        if(menu._id === submenu.parent) {
                            subMenuArr.push(submenu);
                        }
                    }
                    menu.children = subMenuArr;
                }
                result.menus = menus;
                console.log('data: ',result);
                return result;
            } else {
                return null;
            }
        } catch(err) {
            console.log(err);
            throw err;
        }
    }

}



