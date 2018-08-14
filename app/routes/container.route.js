import express from 'express';
import MongoDB from './../db/mongodb';
import Joi from 'joi';
import validator from 'express-joi-validator';

const router = express.Router();

const schema = {
	body: {
		containerName: Joi.string().min(3).required(),
		containerDescription: Joi.string().optional()
	}
}

router.post('/', validator(schema,{allowUnknown: true, abortEarly: false}), (req, res, next) => {
    const db = MongoDB.getDB();
    let data = db.db().collection('users').save(req.body);
    res.status(200).send(data);
});

export default router;