import express from 'express';
import Joi from 'joi';
import validator from 'express-joi-validator';
import logger from '../logger';
import { UserHandler } from '../handler/user.handler';

const router = express.Router();
const log = logger.Logger;


const schema = {
	body: {
		emailId: Joi.string().email().required()
	}
}

// get ALL
router.get('/', (req, res) => {
	let resultPromise = UserHandler.getAll();
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

	let resultPromise = UserHandler.getOne(id);
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
	let emailExist = UserHandler.emailIdExist(req.body.emailId);
	emailExist.then(function(data) {
		if(data) {
			res.status(412).send("EmailId exist");
		} else {
			UserHandler.getByUserName(req.body.userName).then(data => {
				if(data) {
					res.status(412).send("Username exist");
				} else{
					let resultPromise = UserHandler.save(req.body);
					resultPromise.then(function (result) {
						if(result instanceof Error){
							res.status(412).send(result.message);
						} else {
							res.status(200).send(result);
						} 
					}).catch(err => {
						log.error(err);
						res.status(500).send({ "message": "Something went wrong" });
					});
				}
			})
			
			
		}
	});
});

// update ONE obj
router.put('/', validator(schema, { allowUnknown: true, abortEarly: false }), (req, res, next) => {	
	let emailExist = UserHandler.emailIdExistForUpdate(req.body);
	emailExist.then(function(data) {
		if(data) {
			res.status(412).send("EmailId exist");
		} else {
			let resultPromise = UserHandler.updateOne(req.body);
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
		}
	})
});


// get ONE
router.delete('/:id', (req, res) => {
	let id = req.params.id;
	
	let resultPromise = UserHandler.deleteOne(id);
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

export default router;