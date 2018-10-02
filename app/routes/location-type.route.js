import express from 'express';
import Joi from 'joi';
import validator from 'express-joi-validator';
import { LocationTypeHandler } from '../handler/location-type.handler';
import logger from '../logger';


const log = logger.Logger;

var data = [
	{
		"level": 1,
		"name": "Facility"
	},
	{
		"level": 2,
		"name": "Site"
	},
	{
		"level": 3,
		"name": "Warehouse"
	},
	{
		"level": 4,
		"name": "Room"
	},
	{
		"level": 5,
		"name": "Section"
	}
];

const router = express.Router();
// please separate  out 
const schema = {
	body: {
		name: Joi.string().min(3).required(),
		alias: Joi.string().min(1).required(),
		level: Joi.number().required()
	}
}

// get ALL
router.get('/', (req, res) => {
	let resultPromise = LocationTypeHandler.getAll();
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

	let resultPromise = LocationTypeHandler.getOne(id);
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
	let resultPromise = LocationTypeHandler.save(req.body);
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
	
	let resultPromise = LocationTypeHandler.updateOne(req.body);

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
	
	let resultPromise = LocationTypeHandler.deleteOne(id);
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