import express from 'express';
import Joi from 'joi';
import validator from 'express-joi-validator';
import logger from '../logger';
import { EquipmentHandler } from '../handler/equipment.handler';


const log = logger.Logger;

const router = express.Router();
// please separate  out 
const schema = {
	body: {
		name: Joi.string().min(3).required()

	}
}


// get ONE
router.get('/:id', (req, res) => {
	let id = req.params.id;
	//let clientId  = req.params.clientId;
	console.log("id->", id)
	let resultPromise = EquipmentHandler.getOne(id);

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
	let resultPromise = EquipmentHandler.save(req.body);
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

	let resultPromise = EquipmentHandler.updateOne(req.body);

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
router.delete('/:id', (req, res) => {
	let id = req.params.id;

	let resultPromise = EquipmentHandler.deleteOne(id);
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

	// sample 
	let tempMedian = req.query.tMedian;
	let humidityMedian = req.query.hMedian;
	let co2Median = req.query.cMedian;


	// for pagination flow 
	if (pageIndex && pageSize) {
		let pagination = {}
		pagination.start = parseInt(pageIndex) * parseInt(pageSize);
		pagination.end = parseInt(pageSize);
		if (searchText) {
			pagination.searchText = searchText;
		}
		let resultPromise = EquipmentHandler.getPagedData(pagination);

		resultPromise.then(function (result) {
			if (result) {
				res.status(200).send(result);
			}
		}).catch(err => {
			//
			log.error(err);
			res.status(500).send({ "message": "Something went wrong" });
		});
	}
	else if (tempMedian || humidityMedian || co2Median) {
		let criteria = {};
		console.log('config controls');
		if (tempMedian) {
			criteria['temperature.median'] = parseInt(tempMedian)
			console.log('config controls ->', criteria);

		}
		if (humidityMedian) {
			console.log('h', criteria);
			criteria['humidity.median'] = parseInt(humidityMedian);
		}
		if (co2Median) {
			console.log('c', criteria);
			criteria['co2.median'] = parseInt(co2Median);
		}
		console.log('config controls', criteria);

		let resultPromise = EquipmentHandler.getByCriteria(criteria);
		resultPromise.then(function (result) {
			if (result) {
				res.status(200).send(result);
			}
		}).catch(err => {
			//
			log.error(err);
			res.status(500).send({ "message": "Something went wrong" });
		});
	}

	else {
		let resultPromise = EquipmentHandler.getAll();
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



export default router;