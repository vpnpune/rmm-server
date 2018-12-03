import express from 'express';
import Joi from 'joi';
import validator from 'express-joi-validator';
import { RolesHandler } from '../handler/roles.handler';
import logger from '../logger';

const router = express.Router();

const log = logger.Logger;
// please separate  out 
const schema = {
	body: {
		roleName: Joi.string().min(1).max(255).required(),
		permissions: Joi.array().items(Joi.string().min(1).max(255).required())
	}
}

// get ALL
router.get('/', (req, res) => {
	let resultPromise = RolesHandler.getAll();
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

	let resultPromise = RolesHandler.getOne(id);
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
	let resultPromise = RolesHandler.save(req.body);
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
	
	let resultPromise = RolesHandler.updateOne(req.body);

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
	let resultPromise = RolesHandler.deleteOne(id);
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