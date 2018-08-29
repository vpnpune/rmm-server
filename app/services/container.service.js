import mongodb from "../db/mongodb";
import {addId} from "../db/id-generator";

const collectionName="containerType";

export class ContainerService {
    // get all items from collection
    static async getAll() {
        const db = mongodb.getDB();
        let result =await db.db().collection(collectionName).find({}).toArray();
        //console.log(JSON.stringify(data));
        return result;

    }
    // get ONE object from db
    // please correct @Pankaj
    static async getOne(id) {
        try{
            // const db = mongodb.getDB();
            let result =await db.db().collection(collectionName).findOne({"_id":id});
            return result;
        } catch(err) {
            throw err;
        }

    }
    // save object to db
    static async save(data) {
        const db = mongodb.getDB();
        let result =await db.db().collection(collectionName).save(addId(data));
        //console.log(JSON.stringify(data));
        return result;

    }
}



