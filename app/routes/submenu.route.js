import express from 'express';
import logger from '../logger';
import ApplicationError from '../model/application-error';
import {INTERNAL_SERVER_ERROR} from '../constants';
import { SubmenuHandler } from '../handler/submenu.handler';

const router = express.Router();

const log = logger.Logger;


// get ALL
router.get('/', (req, res) => {
	let resultPromise = SubmenuHandler.getAll();
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		} else {
			res.status(200).send([]);
		}
	}).catch(err => {
		log.error(err);
		throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
	});
});


// get ONE
router.get('/:id', (req, res) => {
	let id = req.params.id;
	let resultPromise = SubmenuHandler.getOne(id);
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		} else {
			res.status(200).send([]);
		}
	}).catch(err => {
		log.error(err);
		throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
	});
});



// save obj
router.post('/', (req, res) => {
	let resultPromise = SubmenuHandler.save(req.body);
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		} else {
			res.status(200).send([]);
		}
	}).catch(err => {
		log.error(err);
		throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
	});

});

// update ONE obj
router.put('/', (req, res) => {
	
	let resultPromise = SubmenuHandler.updateOne(req.body);

	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		} else {
			res.status(200).send([]);
		}
	}).catch(err => {
		log.error(err);
		throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
	});

});


// get ONE
router.delete('/:id', (req, res) => {
	let id = req.params.id;
	let resultPromise = SubmenuHandler.deleteOne(id);
	resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		} else {
			res.status(200).send([]);
		}
	}).catch(err => {
		log.error(err);
		throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
	});
});

export default router;