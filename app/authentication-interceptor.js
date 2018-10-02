// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------

import express from 'express';
import jwt from 'jsonwebtoken';
import app from './server';
import { log } from 'util';
import ApplicationError from './model/application-error'
import {TOKEN_VERIFICATION_FAILED} from './constants';
const router = express.Router();

router.use(function(req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.params.token || req.headers['x-access-token'];
	
	// decode token
	if (token) {
		console.log(token);
		// verifies secret and checks exp
		jwt.verify(token, app.get('secret'), function(err, decoded) {
			console.log(TOKEN_VERIFICATION_FAILED);
			if (err) {
				return res.status(403).send(new ApplicationError(TOKEN_VERIFICATION_FAILED,403));		
			} else {
				// if everything is good, send to request for use in other routes
				req.decoded = decoded;	
				app.set('user',decoded.loginId);
				next();
			}
		});
	} else {
		// if there is no token return an error
		return res.status(403).send(new ApplicationError(TOKEN_VERIFICATION_FAILED,403));
	}
});

export default router;