import express from 'express';
import Joi from 'joi';
import validator from 'express-joi-validator';
import { StorageConfigHandler } from '../handler/storage-config.handler';
import logger from '../logger';

const router = express.Router();
const log = logger.Logger;

// please separate  out 
const schema = {
	body: {
		 
		conditionType: Joi.string().min(3).required(),
		median: Joi.number().required().min(Joi.ref('lowerLimit')).max(Joi.ref('upperLimit')),
		lowerLimit: Joi.number().required().max(Joi.ref('median')),
		upperLimit: Joi.number().required().min(Joi.ref('median'))
	}
}
//request params as a string on condition key
//i.e /api/storageConfig/temperature
router.get('/:key', (req, res) => {
	let key = req.params.key;
	
	let resultPromise = StorageConfigHandler.getAll(key);
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
router.get('/:key/:id', (req, res) => {
	let id = req.params.id;
	let key = req.params.key; // ignore key as it is unique

	let resultPromise = StorageConfigHandler.getOne(id);
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



// save obj
router.post('/', validator(schema, { allowUnknown: true, abortEarly: false }), (req, res, next) => {
	let resultPromise = StorageConfigHandler.save(req.body);
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send({"_id":result.insertedId});
		} else {
			res.status(200).send([]);
		}
	}).catch(err => {
		log.error(err);
		res.status(500).send({ "message": "Something went wrong" });
	});

});

// update ONE obj
router.put('/', validator(schema, { allowUnknown: true, abortEarly: false }), (req, res, next) => {
	
	let resultPromise = StorageConfigHandler.updateOne(req.body);

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
router.delete('/:key/:id', (req, res) => {
	let id = req.params.id;
	
	let resultPromise = StorageConfigHandler.deleteOne(id);
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