import express from 'express';
import Joi from 'joi';
import validator from 'express-joi-validator';
import logger from '../logger';

import {
	UserHandler
} from '../handler/user.handler';
import {
	RolesHandler
} from '../handler/roles.handler';
import app from '../server';
import { EquipmentNodeHandler } from '../handler/equipment-node.handler';

const router = express.Router();
const log = logger.Logger;

// please separate  out 
const schema = {
	body: {
		name: Joi.string().min(3).max(20).required().error(errors => {

			return {
				message: "Name must be min 3 and max 20 charachters long."
			};
		}),
		// prefix: Joi.string().max(4).required().error(errors => {
		// 	return {
		// 		message: "Prefix cannot be more than 4 charachters."
		// 	};
		// }),
	}
}



// get ONE
router.get('/:id', (req, res) => {
	let id = req.params.id;

	let resultPromise = EquipmentNodeHandler.getNodesForEquipment(id);
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
	let resultPromise = EquipmentNodeHandler.save(req.body);
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

// update ONE obj
router.put('/', validator(schema, {
	allowUnknown: true,
	abortEarly: false
}), (req, res, next) => {

	let resultPromise = EquipmentNodeHandler.updateOne(req.body);

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
router.delete('/:id', (req, res) => {
	let id = req.params.id;

	let resultPromise = EquipmentNodeHandler.deleteOne(id);
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