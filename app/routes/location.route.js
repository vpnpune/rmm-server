import express from 'express';
import Joi from 'joi';
import validator from 'express-joi-validator';
import { LocationHandler } from '../handler/location.handler';
import logger from '../logger';

const router = express.Router();

const log = logger.Logger;
// please separate  out 
const schema = {
	body: {
		locationName: Joi.string().min(1).max(4).required(),
		type: Joi.object().exist(),
		type:Joi.object({_id:Joi.string().required()})
	}
}

// get ALL
router.get('/', (req, res) => {
	let resultPromise = LocationHandler.getAll();
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

	let resultPromise = LocationHandler.getOne(id);
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
	let resultPromise = LocationHandler.save(req.body);
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
	
	let resultPromise = LocationHandler.updateOne(req.body);

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
	let resultPromise = LocationHandler.deleteOne(id);
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

//ie5q0jmxfuubg
// get ONE
router.get('/getParent/:parentId', (req, res) => {
	let parentId = req.params.parentId;
	console.log(parentId);
	let resultPromise = LocationHandler.getExceptParentLocationTypeList(parentId);
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
router.get('/canBeDeleted/:parentId', (req, res) => {
	let parentId = req.params.parentId;
	console.log(parentId);
	let resultPromise = LocationHandler.checkIsParentOfAnyItem(parentId);
	resultPromise.then(function (result) {
		console.log(result);
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