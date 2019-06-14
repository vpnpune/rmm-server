import express from 'express';
import Joi from 'joi';
import validator from 'express-joi-validator';
import logger from '../logger';
import {
	ContainerHandler
} from '../handler/container.handler';
import {
	UserHandler
} from '../handler/user.handler';
import {
	RolesHandler
} from '../handler/roles.handler';
import app from './../server';

const router = express.Router();
const log = logger.Logger;

// please separate  out 
const schema = {
	body: {
		containerName: Joi.string().min(3).max(20).required().error(errors => {

			return {
				message: "Name must be min 3 and max 20 charachters long."
			};
		}),
		prefix: Joi.string().max(4).required().error(errors => {
			return {
				message: "Prefix cannot be more than 4 charachters."
			};
		}),
	}
}
// get ALL
router.get('/', (req, res) => {
	let resultPromise = ContainerHandler.getAll();
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

	let resultPromise = ContainerHandler.getOne(id);
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
	let resultPromise = ContainerHandler.save(req.body);
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

	let resultPromise = ContainerHandler.updateOne(req.body);

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


// get ONE
router.delete('/:id', (req, res) => {
	let id = req.params.id;

	let resultPromise = ContainerHandler.deleteOne(id);
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

function checkForPermissions(permissionName) {
	// let loginId = app.get('user');
	// let resultPromise = UserHandler.getOne(loginId);
	// resultPromise.then(function (result) {
	// 	if (result) {
	// 		let user = result;
	// let permissions = user.permissions;
	// if(permissions.includes(permissionName)){
	// 	return true;
	// } else {
	// 	return false;
	// }
	// 	} else {
	// 		log.error("user exist error: ",resut);
	// 		return false;
	// 	}
	// }).catch(err => {
	// 	log.error(err);
	// 	return false;
	// });
}

export default router;