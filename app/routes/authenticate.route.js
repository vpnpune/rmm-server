import express from 'express';
import jwt from 'jsonwebtoken';
import app from './../server';
import ApplicationError from './../model/application-error';
import {USER_DETAILS_VERI_FAILED,INTERNAL_SERVER_ERROR} from '../constants';
import {UserHandler} from './../handler/user.handler';
import logger from '../logger';
import CacheService from './../cache/cache-service'

const router = express.Router();
const log = logger.Logger;

/**
 * @swagger
 * definitions:
 *   users:
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       age:
 *         type: integer
 *       sex:
 *         type: string
 */
/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           $ref: '#/definitions/users'
 *       403:
 *          description: Please provide valid Username.
 *          schema: '#/'
 */

router.post('/', (req, res) => {
    let userName = req.body.uname;
    let password = req.body.password;

    if(!userName || !password) {
        res.status(403).send(new ApplicationError(USER_DETAILS_VERI_FAILED,403));
    } else { 
        let resultPromise = UserHandler.getUserPermissions(userName, password);
        resultPromise.then(function (result) {
            if (result) {
                console.log("user: ",result.menus[0].submenu);
                CacheService.set(result._id,result);
                let token = jwt.sign(result, app.get('secret'), {
                    expiresIn: 86400 // expires in 24 hours
                });
                
                res.status(200).json({
                    status: 200,
                    message: 'Token generated successfully.',
                    token: token,
                    user: result,
                    menus: result.menus
                });
            } else {
                res.status(403).send(new ApplicationError(USER_DETAILS_VERI_FAILED,403));
            }
        }).catch(err => {
            log.error(err);
            throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
        });
    }
});

export default router;
