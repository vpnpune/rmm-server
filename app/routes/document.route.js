import app from '../server'
import express from 'express';
import multer from 'multer';
import logger from '../logger';
import { DocumentHandler } from '../handler/document.handler';
import ApplicationError from '../model/application-error';
import {INTERNAL_SERVER_ERROR} from '../constants';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';

const router = express.Router();
const log = logger.Logger;

aws.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region
});

var s3 = new aws.S3();

var upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: 'rmm-s3-store',
      key: function (req, file, cb) {
          console.log("file: ",file);
          let fileName = file.originalname.substring(0,file.originalname.indexOf('.'))
          cb(null, fileName+"_"+Date.now()+"."+file.originalname.substring(file.originalname.indexOf('.')+1));
      }
  })
});


//use by upload form
router.post('/upload', upload.any(), function (req, res, next) {
  console.log('upload: ',req.files[0]);
  if(undefined !== req.files && null !== req.files && req.files.length === 1){
    let file = req.files[0];
    let document = {};
    document.originalname = file.originalname;
    document.encoding = file.encoding;
    document.mimetype = file.mimetype
    document.size = file.size;
    document.bucket = file.bucket;
    document.key =  file.key;
    document.contentType = document.contentType;
    document.location = file.location;
    document.etag = file.etag;
    document.userId = app.get('user');

    let resultPromise = DocumentHandler.save(document);
      resultPromise.then(function (result) {
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(200).send([]);
      }
    }).catch(err => {
      log.error(err);
      throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
    });
  } else {
    throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
  }
  
});

router.get('/download/:id', function(req, res, next){
  try {
    let id = req.params.id;
    console.log(id);
    let options = {
      Bucket : 'rmm-s3-store',
      Key    : id,
    };

    res.attachment(fileKey);
    let fileStream = s3.getObject(options).createReadStream();
    fileStream.pipe(res);
  } catch(err) {
    throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
  }
});

export default router;
