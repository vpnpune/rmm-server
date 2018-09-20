import express from 'express';
import MongoDB from './../db/mongodb';
import jwt from 'jsonwebtoken';
import app from './../server';

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


    if(!userName) {
        res.status(403).send({"message":"Please provide valid Username."});
    } else if(!password) {
        res.status(403).send({"message":"Please provide valid Password."});
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
        res.status(403).send({"message":"Please provide valid Username & Password."});
    }
});

export default router;