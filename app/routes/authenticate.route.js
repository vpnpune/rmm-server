import express from 'express';
import MongoDB from './../db/mongodb';
import jwt from 'jsonwebtoken';
import app from './../server';
import ApplicationError from './../model/application-error';
import USER_DETAILS_VERI_FAILED from '../constants';
const router = express.Router();

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
    } else if(userName === "rmmadmin" && password === "labmanus") {
        let payload = {
            loginId : "admin",
            admin : true
        };
        let token = jwt.sign(payload, app.get('secret'), {
            expiresIn: 86400 // expires in 24 hours
        });

        res.json({
            status: 200,
            message: 'Token generated successfully.',
            token: token
        });
    } else {
        res.status(403).send(new ApplicationError(USER_DETAILS_VERI_FAILED,403));
    }
});

export default router;
