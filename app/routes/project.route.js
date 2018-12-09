import express from 'express';
import Joi from 'joi';
import validator from 'express-joi-validator';
import { ProjectHandler } from '../handler/project.handler';

import logger from '../logger';
const log = logger.Logger;

const router = express.Router();
// please separate  out 
const schema = {
	body: {
		name: Joi.string().min(3).required()
	}
}


// get ALL
router.get('/:clientId', (req, res) => {
	let start = req.query.start;
	let end = req.query.end;
	let searchText = req.query.searchText;
	let clientId = req.params.clientId;
	// for pagination flow 
	if (start !== undefined && end !== undefined) {
		let pagination ={}
		pagination.start = start;
		pagination.end = end;
		pagination.searchText = searchText;
		let resultPromise = ProjectHandler.getAll(clientId);
		
		resultPromise.then(function (result) {
			if (result) {
				res.status(200).send(result);
			}
		}).catch(err => {
			//
			log.error(err);
			res.status(500).send({ "message": "Something went wrong" });
		});
	} else {
		let resultPromise = ProjectHandler.getAll(clientId);
		resultPromise.then(function (result) {
			if (result) {
				res.status(200).send(result);
			}
		}).catch(err => {
			log.error(err);
			res.status(500).send({ "message": "Something went wrong" });
		});
	}



});


// get ALL
router.get('/:clientId', (req, res) => {
	let clientId = req.params.clientId;

	let resultPromise = ProjectHandler.getAll(clientId);
	resultPromise.then(function (result) {
		if (result) {

			res.status(200).send(result);
		}
	}).catch(err => {
		log.error(err);
		res.status(500).send({ "message": "Something went wrong" });
	});
});


// get ONE
router.get('/:clientId/:projectId', (req, res) => {
	let projectId = req.params.projectId;
	let clientId = req.params.clientId;
	let resultPromise = ProjectHandler.getOne(clientId,projectId);
	
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		}
	}).catch(err => {
		log.error(err);
		res.status(500).send({ "message": "Something went wrong" });
	});
});



// save obj
router.post('/', validator(schema, { allowUnknown: true, abortEarly: false }), (req, res, next) => {
	let resultPromise = ProjectHandler.save(req.body);
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send({"_id":result.insertedId});
		}
	}).catch(err => {
		log.error(err);
		res.status(500).send({ "message": "Something went wrong" });
	});

});

// update ONE obj
router.put('/', validator(schema, { allowUnknown: true, abortEarly: false }), (req, res, next) => {
	
	let resultPromise = ProjectHandler.updateOne(req.body);

	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		}
	}).catch(err => {
		log.error(err);
		res.status(500).send({ "message": "Something went wrong" });
	});

});


// get ONE
router.delete('/:clientId/:projectId', (req, res) => {
	let projectId = req.params.projectId;
	let clientId = req.params.clientId;
	let resultPromise = ProjectHandler.deleteOne(clientId,projectId);
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		}
	}).catch(err => {
		log.error(err);
		res.status(500).send({ "message": "Something went wrong" });
	});
});


export default router;