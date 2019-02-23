import express from 'express';
import Joi from 'joi';
import validator from 'express-joi-validator';

import logger from '../logger';
import { EquipmentReservationHandler } from '../handler/equipment-reservation.handler';
const log = logger.Logger;

const router = express.Router();
// please separate  out 
const schema = Joi.array().items(Joi.object({
	equipmentId: Joi.string().required(),
	clientId: Joi.string().required()

}))
// save obj
// validator(schema, { allowUnknown: true, abortEarly: false })
router.post('/', (req, res, next) => {
	let resultPromise = EquipmentReservationHandler.save(req.body);

	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		}
	}).catch(err => {
		log.error(err);
		res.status(500).send({ "message": "Something went wrong" });
	});

});


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
		let resultPromise = EquipmentReservationHandler.getPagedData(pagination, clientId);

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
		let resultPromise;
		if (clientId)
			resultPromise = EquipmentReservationHandler.getAllWithCriteria(clientId);
		else
			resultPromise = EquipmentReservationHandler.getAll();

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
	let resultPromise = EquipmentReservationHandler.getOne(projectId);

	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		}
	}).catch(err => {
		log.error(err);
		res.status(500).send({ "message": "Something went wrong" });
	});
});





// update ONE obj
router.put('/', validator(schema, { allowUnknown: true, abortEarly: false }), (req, res, next) => {

	let resultPromise = EquipmentReservationHandler.updateOne(req.body);

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
	let resultPromise = EquipmentReservationHandler.deleteOne(projectId);
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