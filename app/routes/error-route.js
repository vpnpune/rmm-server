import express from 'express';
import logger from '../logger';

const router = express.Router();
const log = logger.Logger;

// all type of mappings
router.all('/', (req, res) => {
	res.status(404).send({ "message": "Endpoint not found" });
});

export default router;