import app from './../server'
import express from 'express';
import multer from 'multer';
import logger from '../logger';
import Document from '../model/document';
import { DocumentHandler } from '../handler/document.handler';
const router = express.Router();
const log = logger.Logger;

let upload = multer({ storage: multer.memoryStorage() });

router.post('/profile', upload.any(), function (req, res, next) {
  console.log(req.files);
  if(req.files.length > 0) {
    let document = new Document();
    document.userId = app.get('user');
    document.fileName = req.files[0].originalname;
    document.mimeType = req.files[0].mimetype;
    document.data = req.files[0].buffer;
    
    let resultPromise = DocumentHandler.save(document);
	  resultPromise.then(function (result) {
		if (result) {
			res.status(200).send(result);
		} else {
			res.status(200).send([]);
		}
	}).catch(err => {
		log.error(err);
		res.status(500).send({ "message": "Something went wrong" });
	});
  } else {
    return res.status(400).send("Bad Request");
  }
  
});

export default router;
