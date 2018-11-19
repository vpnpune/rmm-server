import app from './../server'
import express from 'express';
import multer from 'multer';
import logger from '../logger';
import { DocumentHandler } from '../handler/document.handler';
import ApplicationError from './../model/application-error';
import { INTERNAL_SERVER_ERROR } from './../constants';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';

const router = express.Router();
const log = logger.Logger;

aws.config.update({
  accessKeyId:  process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region
});

var s3 = new aws.S3();

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'rmm-s3-store',
    key: function (req, file, cb) {
      let fileName = file.originalname.substring(0, file.originalname.indexOf('.'))
      cb(null, fileName + "_" + Date.now() + "." + file.originalname.substring(file.originalname.indexOf('.') + 1));
    }
  })
});


//use by upload form
router.post('/upload', upload.any(), function (req, res, next) {
  //console.log(req)
  console.log("id ", req.body.identifier);
  console.log("mod ", req.body.MODULE_CODE);

  if (undefined !== req.files && null !== req.files && req.files.length === 1) {
    let file = req.files[0];
    let document = {};
    document.originalname = file.originalname;
    document.encoding = file.encoding;
    document.mimetype = file.mimetype
    document.size = file.size;
    document.bucket = file.bucket;
    document.key = file.key;
    document.contentType = document.contentType;
    document.location = file.location;
    document.etag = file.etag;
    document.moduleCode = req.body.MODULE_CODE;
    document.foreignRef = req.body.identifier
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
      throw new ApplicationError("Failed to Save", 500);
    });
  } else {
    throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
  }

});

router.get('/download/:id', function (req, res, next) {
  try {
    let id = req.params.id;
    console.log(id);


    let resultPromise = DocumentHandler.getOne(id);
    resultPromise.then(function (result) {
      if (result) {
        let options = {
          Bucket: 'rmm-s3-store',
          Key: result.key,
        };
        console.log(result)
        let fileStream = s3.getObject(options).createReadStream();
        res.attachment(result.key);

        fileStream.pipe(res);
      } else {
        log.error(err);
        throw new ApplicationError("Document Not Found", 500);
      }
    }).catch(err => {
      log.error(err);
      throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
    });


  } catch (err) {
    log.error(err);

    throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
  }
});


router.delete('/delete/:id', function (req, res, next) {
  try {
    let id = req.params.id;
    console.log(id);
    // remove from S3
    // then remove from DB
    let resultPromise = DocumentHandler.getOne(id);


    resultPromise.then(function (result) {
      if (result) {
        let options = {
          Bucket: result.bucket,
          Key: result.key,
        };
        s3.deleteObject(options, function (err, data) {
          if (data.DeleteMarker) {
            resultPromise = DocumentHandler.deleteOne(id);
            resultPromise.then(function(result){
              return res.status(200).send({"deleted":true});
            });

            }
        });
      } else {
        log.error(err);
        throw new ApplicationError("Document Not Found", 500);
      }
    }).catch(err => {
      log.error(err);
      throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
    });


  } catch (err) {
    log.error(err);

    throw new ApplicationError(INTERNAL_SERVER_ERROR, 500);
  }
});

export default router;
