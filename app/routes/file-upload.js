import express from 'express';
import multer from 'multer';
import logger from '../logger';

const router = express.Router();
const log = logger.Logger;

let upload = multer({ storage: multer.memoryStorage() });

router.post('/profile', upload.any(), function (req, res, next) {
  console.log(req.files);
  console.log(req.files[0].buffer);
});

export default router;
