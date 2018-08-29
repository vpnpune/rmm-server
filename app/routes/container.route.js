import express from 'express';
import Joi from 'joi';
import validator from 'express-joi-validator';
import { ContainerService } from './../services/container.service';
import logger from '../logger';


const router = express.Router();
const log = logger.Logger;

// please separate  out 
const schema = {
	body: {
		containerName: Joi.string().min(3).required(),
		containerDescription: Joi.string().optional()
	}
}
// get ALL
router.get('/', (req, res) => {
	let resultPromise = ContainerService.getAll();
	resultPromise.then(function (result) {
		if (result){
			res.send(result);			
		}
	}).catch(err => {
		res.send(err);
	});
});
// get ONE
router.get('/:id', (req, res) => {
	let id = req.params.id;
	
	let resultPromise = ContainerService.getOne(id);
	resultPromise.then(function (result) {
		if (result){
			res.status(200).send(result);			
		}
	}).catch(err => {
		log.error(err);
		res.status(500).send({"message":"Something went wrong"});
	});
});



// save obj
router.post('/', validator(schema, { allowUnknown: true, abortEarly: false }), (req, res, next) => {
	let resultPromise = ContainerService.save(req.body);
	resultPromise.then(function (result) {
		if (result){
			res.status(200).send(result);			
		}
	}).catch(err => {
		res.send(err);
	});
	
});

const awaitHandlerFactory = (middleware) => {
	return async (req, res, next) => {
	  try {
		await middleware(req, res, next)
	  } catch (err) {
		next(err)
	  }
	}
  }

export default router;