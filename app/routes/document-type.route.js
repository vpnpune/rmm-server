import express from 'express';
import Joi from 'joi';
import validator from 'express-joi-validator';
import {
	DocumentTypeHandler
} from '../handler/document-type.handler';
import logger from '../logger';
const log = logger.Logger;
const router = express.Router();
// please separate  out 
const schema = {
	body: {
		typeName: Joi.string().min(8).required(),
		description: Joi.string().optional(),
		maxSize: Joi.number().max(200).min(100),
		acceptableFormats: Joi.array().required().min(1)
	}
}


// get ALL
router.get('/', (req, res) => {
	let resultPromise = DocumentTypeHandler.getAll();
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

	let resultPromise = DocumentTypeHandler.getOne(id);
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
	let resultPromise = DocumentTypeHandler.save(req.body);
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		} else {
			res.status(200).send([]);
		}
	}).catch(err => {
		log.error(err);
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

	let resultPromise = DocumentTypeHandler.updateOne(req.body);

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

	let resultPromise = DocumentTypeHandler.deleteOne(id);
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