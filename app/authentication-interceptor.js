// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------

import express from 'express';
import jwt from 'jsonwebtoken';
import app from './server';
import { log } from 'util';
import ApplicationError from './model/application-error'
import {USER_DETAILS_VERI_FAILED,INTERNAL_SERVER_ERROR, UNAUTHORIZED_ACCESS,TOKEN_VERIFICATION_FAILED} from './constants';
const router = express.Router();
import CacheService from './cache/cache-service';

router.use(function(req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.params.token || req.headers['x-access-token'];
	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, app.get('secret'), function(err, decoded) {
			if (err) {
				return res.status(403).send(new ApplicationError(TOKEN_VERIFICATION_FAILED,403));
			} else {
				// if everything is good, send to request for use in other routes
				req.decoded = decoded;	
				app.set('user',decoded.userName);

				let mapping = req.originalUrl.substring(getPosition(req.originalUrl,'/',2)+1,getPosition(req.originalUrl,'/',3));
				let method = req.method;
				let resultPromise = CacheService.get(decoded.userName);
				resultPromise.then(function (result) {
					app.set('userRole',result.roles);
					if (result) {
						if(result.roles.includes('SuperAdmin') || (result.permissions && checkPermissions(result.permissions, mapping, method ))) {
							next();
						} else {
							res.status(403).send(new ApplicationError(UNAUTHORIZED_ACCESS,401));
						}
						
					} else {
						res.status(403).send(new ApplicationError(USER_DETAILS_VERI_FAILED,403));
					}
				}).catch(err => {
					throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
				});
			}
		});
	} else {
		// if there is no token return an error
		return res.status(403).send(new ApplicationError(TOKEN_VERIFICATION_FAILED,403));
	}
});

function getPosition(string, subString, index) {
	return string.split(subString, index).join(subString).length;
}

function checkPermissions(permissions,url, operation ) {
	try{
		let shortUrl; 
		if(url.indexOf("?") !== -1){
			shortUrl = url.substring(0,url.indexOf("?"));
		}
		for(let permission of permissions) {
			if((permission.url === url || permission.url === shortUrl) && permission.operation === operation) {
				return true;
			}
		}
		return false;
	} catch(err) {
		console.log(err);
	}
}

export default router;