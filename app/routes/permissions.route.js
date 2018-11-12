import express from 'express';
import Joi from 'joi';
import validator from 'express-joi-validator';
import { PermissionsHandler } from '../handler/permissions.handler';
import logger from '../logger';

const router = express.Router();

const log = logger.Logger;
// please separate  out 
const schema = {
	body: {
		name: Joi.string().min(1).max(255).required(),
		url: Joi.string().required()
	}
}

// get ALL
router.get('/', (req, res) => {
	let resultPromise = PermissionsHandler.getAll();
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		} else {
			res.status(200).send([]);
		}
	}).catch(err => {
		log.error(err);
		throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
	});
});


// get ONE
router.get('/:id', (req, res) => {
	let id = req.params.id;

	let resultPromise = PermissionsHandler.getOne(id);
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		} else {
			res.status(200).send([]);
		}
	}).catch(err => {
		log.error(err);
		throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
	});
});



// save obj
router.post('/', validator(schema, { allowUnknown: true, abortEarly: false }), (req, res, next) => {
	let resultPromise = PermissionsHandler.save(req.body);
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		} else {
			res.status(200).send([]);
		}
	}).catch(err => {
		log.error(err);
		throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
	});

});

// update ONE obj
router.put('/', validator(schema, { allowUnknown: true, abortEarly: false }), (req, res, next) => {
	
	let resultPromise = PermissionsHandler.updateOne(req.body);

	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		} else {
			res.status(200).send([]);
		}
	}).catch(err => {
		log.error(err);
		throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
	});

});


// get ONE
router.delete('/:id', (req, res) => {
	let id = req.params.id;
	let resultPromise = PermissionsHandler.deleteOne(id);
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		} else {
			res.status(200).send([]);
		}
	}).catch(err => {
		log.error(err);
		throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
	});
});

export default router;