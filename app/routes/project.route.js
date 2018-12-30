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
router.get('/', (req, res) => {
	let pageIndex = req.query.pageIndex;
	let pageSize = req.query.pageSize;
	let searchText = req.query.filter;
	let queryParams = {};
	//
	let clientId = req.query.clientId;
	queryParams.clientId = clientId;

	// for pagination flow 
	if (pageIndex && pageSize) {
		let pagination = {}
		pagination.start = parseInt(pageIndex) * parseInt(pageSize);
		pagination.end = parseInt(pageSize);
		pagination.queryParams = queryParams;
		if (searchText) {
			pagination.searchText = searchText;
		}
		let resultPromise = ProjectHandler.getPagedData(pagination);

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
		let resultPromise = ProjectHandler.getAll();
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


// get ONE
router.get('/:projectId', (req, res) => {
	let projectId = req.params.projectId;
	let resultPromise = ProjectHandler.getOne(projectId);

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
			console.log(result)
			res.status(200).send(result.ops[0]);
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
router.delete('/:projectId', (req, res) => {
	let projectId = req.params.projectId;
	let resultPromise = ProjectHandler.deleteOne(projectId);
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		}
	}).catch(err => {
		log.error(err);
		res.status(500).send({ "message": "Something went wrong" });
	});
});

router.get('/project/all', (req, res) => {
	let resultPromise = ProjectHandler.getProjectsWithoutClientId();
	
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