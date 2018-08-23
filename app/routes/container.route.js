import express from 'express';
import MongoDB from './../db/mongodb';
import Joi from 'joi';
import validator from 'express-joi-validator';

const router = express.Router();
// please separate  out 
const schema = {
	body: {
		containerName: Joi.string().min(3).required(),
		containerDescription: Joi.string().optional()
	}
}
router.get('/', (req, res) => {
	const db = MongoDB.getDB();
	db.db().collection('containerType').find({}).toArray(function (err, results) {
		if (err)
			res.send(err);
		res.send(results);
	});
});

// save obj
router.post('/', validator(schema,{allowUnknown: true, abortEarly: false}), (req, res, next) => {
    const db = MongoDB.getDB();
	// asyncronous 
	let data = db.db().collection('containerType').save(req.body);
    res.status(200).send(data);
});

export default router;