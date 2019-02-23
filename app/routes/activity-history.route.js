import express from 'express';

import logger from '../logger';
import { ActivityHistoryHandler } from '../handler/activity-history.handler';
import * as Collection from '../db/collection-constants';

const router = express.Router();
const log = logger.Logger;

//i.e /api/storageConfig/temperature
router.get('/', (req, res) => {
	const collectionName = Collection.ACTIVITY_HISTORY;

	let resultPromise = ActivityHistoryHandler.getAll(collectionName);
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		} else {
			res.status(200).send([]);
		}
	}).catch(err => {
		log.error(err);
		res.status(500).send({ "message": "Something went wrong" });
	});
});

// get ONE
router.get('/:collectionName', (req, res) => {
	let collectionName = req.params.collectionName;
	console.log("collection Name",collectionName)
	let resultPromise = MasterHandler.getWithKey(collectionName)
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		} else {
			res.status(200).send([]);
		}
	}).catch(err => {
		log.error(err);
		res.status(500).send({ "message": "Something went wrong" });
	});
});

export default router;