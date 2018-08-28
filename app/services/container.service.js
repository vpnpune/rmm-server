import mongodb from "../db/mongodb";
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
        console.log("get 1 called");
        const objectID = mongodb.getObjectId;
        id= objectID(id);
        console.log(id);

        let result =await db.db().collection(collectionName).findOne({"_id":objectID(id)});
        //let result =await db.db().collection(collectionName).findOne({"containerName":"Vial"});

        console.log(JSON.stringify(result));
        return result;

    }
    // save object to db
    static async save(data) {
        const db = mongodb.getDB();
        let result =await db.db().collection(collectionName).save(data);
        //console.log(JSON.stringify(data));
        return result;

    }
}



