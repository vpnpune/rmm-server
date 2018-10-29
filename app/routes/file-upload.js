import app from './../server'
import express from 'express';
import multer from 'multer';
import logger from '../logger';
import Document from '../model/document';
import { DocumentHandler } from '../handler/document.handler';
const router = express.Router();
const log = logger.Logger;
const fs = require('fs');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3')



aws.config.update({
  accessKeyId: 'XXXX',
  secretAccessKey: 'XXXX',
  region: 'XXXX'
});
var s3 = new aws.S3();


var upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: 'rmm-s3-store',
      key: function (req, file, cb) {
          console.log("file: ",file);
          cb(null, file.originalname); //use Date.now() for unique file keys
      }
  })
});


//use by upload form
router.post('/profile', upload.any(), function (req, res, next) {
  console.log(res);
  res.send("Uploaded!");
});

export default router;
