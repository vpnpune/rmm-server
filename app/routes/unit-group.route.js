import express from 'express';
import Joi from 'joi';
import validator from 'express-joi-validator';
import logger from '../logger';
import { UnitGroupHandler } from '../handler/unit-group.handler';

const router = express.Router();

const log = logger.Logger;
// please separate  out 
const schema = {
	body: {
		groupName: Joi.string().min(1).max(255).required(),
	}
}

// get ALL
router.get('/', (req, res) => {
	let resultPromise = UnitGroupHandler.getAll();
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
router.get('/:id', (req, res) => {
	let id = req.params.id;

	let resultPromise = UnitGroupHandler.getOne(id);
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
	let resultPromise = UnitGroupHandler.save(req.body);
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

// update ONE obj
router.put('/', validator(schema, { allowUnknown: true, abortEarly: false }), (req, res, next) => {
	
	let resultPromise = UnitGroupHandler.updateOne(req.body);

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
router.delete('/:id', (req, res) => {
	let id = req.params.id;
	let resultPromise = UnitGroupHandler.deleteOne(id);
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		} else {
			res.status(200).send([]);
		}
	}).catch(err => {
		log.error(err);
		res.status(500).send(err);
	});
});


export default router;