import express from 'express';
import logger from '../logger';
import ApplicationError from '../model/application-error';
import {INTERNAL_SERVER_ERROR} from '../constants';
import { MenuHandler } from '../handler/menu.handler';

const router = express.Router();

const log = logger.Logger;


// get ALL Parent Menus
router.get('/', (req, res) => {
	let resultPromise = MenuHandler.getAllParentMenu();
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