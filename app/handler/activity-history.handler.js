import { DatabaseService } from "../db/database.service";
import * as Collection from '../db/collection-constants';

/* SET COLLECTION NAME FIRST*/
const collectionName = Collection.ACTIVITY_HISTORY;

export class ActivityHistoryHandler {
    // get all items from collection
    static async getAll() {
        try {
            let result = await DatabaseService.getAll(collectionName);
            return result;
        } catch (err) {
            throw err;
        }
    }
}
