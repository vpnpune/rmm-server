import express from 'express';
import logger from '../logger';
import ApplicationError from './../model/application-error';
import {MAPPING_NOT_FOUND_ERROR} from './../constants';

const router = express.Router();
const log = logger.Logger;

// all type of mappings
router.all('/', (req, res) => {
	res.status(404).send(new ApplicationError(MAPPING_NOT_FOUND_ERROR, 404));
});

export default router;