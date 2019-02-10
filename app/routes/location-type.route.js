import express from 'express';
import Joi from 'joi';
import validator from 'express-joi-validator';
import {
	LocationTypeHandler
} from '../handler/location-type.handler';
import logger from '../logger';


const log = logger.Logger;

const router = express.Router();
// please separate  out 
const schema = {
	body: {
		name: Joi.string().min(3).max(15).required(),
		alias: Joi.string().min(1).max(3).required()
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

		res.status(500).send({
			"message": "Something went wrong"
		});
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
		res.status(500).send({
			"message": "Something went wrong"
		});
	});
});



// save obj
router.post('/', validator(schema, {
	allowUnknown: true,
	abortEarly: false
}), (req, res, next) => {
	console.log(req.body)
	let resultPromise = LocationTypeHandler.save(req.body);
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		} else {
			res.status(200).send([]);
		}
	}).catch(err => {
		log.error(err)
		console.log(err)
		if (err && err.code == 11000) {
			res.status(400).send({
				"message": "Record already exist",
				"code": 11000
			});
		} else {
			res.status(500).send(err);
		}
	});

});

// update ONE obj
router.put('/', validator(schema, {
	allowUnknown: true,
	abortEarly: false
}), (req, res, next) => {

	let resultPromise = LocationTypeHandler.updateOne(req.body);

	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		} else {
			res.status(200).send([]);
		}
	}).catch(err => {
		if (err && err.code == 11000) {
			res.status(400).send({
				"message": "Record already exist",
				"code": 11000
			});

		} else {
			res.status(500).send(err);
		}
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
		res.status(500).send({
			"message": "Something went wrong"
		});
	});
});


export default router;