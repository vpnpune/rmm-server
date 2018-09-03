import express from 'express';
import userRoutes from './users.route';
import authenticationRoutes from './authenticate.route';
import interceptor from './../authentication-interceptor';
import containerRoutes from './container.route';
import documentType from './document-type.route';
import storageConfig from './storage-config.route';
import location from './location.route';
import endpointNotFound from './error-route';

const router = express.Router();
router.use('/authenticate', authenticationRoutes);
//router.use(interceptor);

//All routers should be attached after this only
router.use('/users', userRoutes);
router.use('/container', containerRoutes);
router.use('/documentType', documentType);
router.use('/storageConfig', storageConfig);
router.use('/location', location);
router.use('/*', endpointNotFound);

export default router;