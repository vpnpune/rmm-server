import express from 'express';
import MongoDB from './../db/mongodb';
import jwt from 'jsonwebtoken';
import app from './../server';
import customError from './../model/custom-error.model'

const router = express.Router();

/**
 * @swagger
 * definition:
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

    customError = new customError()

    if(!userName) {
        customError.status = 403;
        customError.message = "Please provide valid Username.";
        res.status(403).send(customError);
    } else if(!password) {
        customError.status = 403;
        customError.message = "Please provide valid Password.";
        res.status(403).send(customError);
    } else if(userName === "Pankaj" && password === "123456") {
        let payload = {
            loginId : "pankajsaboo",
            admin : true
        };
        console.log('app : ',app);
        let token = jwt.sign(payload, app.get('secret'), {
            expiresIn: 86400 // expires in 24 hours
        });

        res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
        });
    } else {
        customError.status = 403;
        customError.message = "Please provide valid Username & password for login.";
        res.status(403).send(customError);
    }
});

export default router;