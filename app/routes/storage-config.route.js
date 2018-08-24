import express from 'express';
import MongoDB from '../db/mongodb';
import Joi from 'joi';
import validator from 'express-joi-validator';

const router = express.Router();
// please separate  out 
const schema = {
	body: {
		conditionType: Joi.string().min(3).required(),
		median: Joi.number().required(),
		lowerLimit: Joi.number().required(),
		upperLimit: Joi.number().required()
	}
}
//request params as a string on condition key
//i.e /api/storageConfig/temperature
router.get('/', (req, res) => {
	const db = MongoDB.getDB();
	let key="temperature"
	db.db().collection('storageConfig').find({"conditionType":key}).toArray(function (err, results) {
		if (err)
			res.send(err);
		res.send(results);
	});
});

// save obj
router.post('/', validator(schema, { allowUnknown: true, abortEarly: false }), (req, res, next) => {
	const db = MongoDB.getDB();
	// asyncronous 
	let data = db.db().collection('storageConfig').save(req.body);
	res.status(200).send(data);
});

export default router;