import express from 'express';
import Joi from 'joi';
import validator from 'express-joi-validator';
import logger from '../logger';
import { ShipmentHandler } from '../handler/shipment.handler';


const log = logger.Logger;

const router = express.Router();
// please separate  out 
const schema = {
	body: {
		referenceNo: Joi.string().min(3).required()

	}
}
// get ALL
// router.get('/:clientId', (req, res) => {
// 	let start = req.query.start;
// 	let end = req.query.end;
// 	let searchText = req.query.searchText;
// 	let clientId = req.params.clientId;

// 	// for pagination flow 
// 	if (start !== undefined && end !== undefined) {
// 		let pagination ={}
// 		pagination.start = start;
// 		pagination.end = end;
// 		pagination.searchText = searchText;
// 		let resultPromise = ShipmentHandler.getPagedData(clientId, pagination);

// 		resultPromise.then(function (result) {
// 			if (result) {
// 				res.status(200).send(result);
// 			}
// 		}).catch(err => {
// 			//
// 			log.error(err);
// 			res.status(500).send({ "message": "Something went wrong" });
// 		});
// 	} else {
// 		let resultPromise = ShipmentHandler.getAll();
// 		resultPromise.then(function (result) {
// 			if (result) {
// 				res.status(200).send(result);
// 			}
// 		}).catch(err => {
// 			log.error(err);
// 			res.status(500).send({ "message": "Something went wrong" });
// 		});
// 	}



// });


// get ONE
router.get('/:clientId/:id', (req, res) => {
	let id = req.params.id;
	//let clientId  = req.params.clientId;
	console.log("id->", id)
	let resultPromise = ShipmentHandler.getOne(id);

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
	let resultPromise = ShipmentHandler.save(req.body);
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

	let resultPromise = ShipmentHandler.updateOne(req.body);

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

	let resultPromise = ShipmentHandler.deleteOne(id);
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		}
	}).catch(err => {
		log.error(err);
		res.status(500).send({ "message": "Something went wrong" });
	});
});


router.get('/test', (req, res) => {
	let id = req.params.id;

	let resultPromise = ShipmentHandler.getAll();
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		}
	}).catch(err => {
		log.error(err);
		res.status(500).send({ "message": "Something went wrong" });
	});
});
// mat
// get ALL
router.get('/:clientId', (req, res) => {
	let pageIndex = req.query.pageIndex;
	let pageSize = req.query.pageSize;
	let searchText = req.query.filter;
	let clientId = req.params.clientId;
	console.log('s', clientId)
	// for pagination flow 
	if (pageIndex && pageSize) {
		let pagination = {}
		pagination.start = parseInt(pageIndex)*parseInt(pageSize)  ;
		pagination.end = parseInt(pageSize);
		if(searchText){
			pagination.searchText= searchText;	
		}
		let resultPromise = ShipmentHandler.getPagedData(clientId, pagination);

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
		let resultPromise = ShipmentHandler.getAll();
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