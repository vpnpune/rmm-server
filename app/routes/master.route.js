import express from 'express';

import logger from '../logger';
import { MasterHandler } from '../handler/master.handler';
import * as Collection from '../db/collection-constants';

const router = express.Router();
const log = logger.Logger;


//request params as a string on condition key
//i.e /api/storageConfig/temperature
router.get('/countries', (req, res) => {
	const collectionName = Collection.COUNTRIES;

	let resultPromise = MasterHandler.getAll(collectionName);
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

//i.e /api/masters/worldStates
router.get('/worldStates', (req, res) => {
	const collectionName = Collection.WORLD_STATES;

	let resultPromise = MasterHandler.getAll(collectionName);
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
router.get('/worldStates/:countryId', (req, res) => {
	let countryId = req.params.countryId;
	const collectionName = Collection.WORLD_STATES;
	let criteria ={"country_id":parseInt(countryId)};
	let resultPromise = MasterHandler.getWithKey(collectionName,criteria)
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