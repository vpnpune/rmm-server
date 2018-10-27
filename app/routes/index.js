import express from 'express';
import userRoutes from './users.route';
import authenticationRoutes from './authenticate.route';
import interceptor from './../authentication-interceptor';
import containerRoutes from './container.route';
import documentTypeRoutes from './document-type.route';
import storageConfigRoutes from './storage-config.route';
import locationRoutes from './location.route';
import clientRoutes from './client.route';
import projectRoutes from './project.route.';
import locationTypeRoutes from './location-type.route';
import masterRoutes from './master.route';
import dynamicFormRoutes from './dynamic-form.route';
import unitGroupRoutes from './unit-group.route'
import unitDefinitionRoutes from './unit-definition.route'
import endpointNotFound from './error-route';

const router = express.Router();
router.use('/authenticate', authenticationRoutes);
//router.use(interceptor);

//All routers should be attached after this only
router.use('/masters', masterRoutes);
router.use('/users', userRoutes);
router.use('/container', containerRoutes);
router.use('/documentType', documentTypeRoutes);
router.use('/storageConfig', storageConfigRoutes);
router.use('/locationNodes', locationRoutes);///reusing location route as location is discarded
router.use('/client', clientRoutes);
router.use('/project', projectRoutes);
router.use('/locationType', locationTypeRoutes);
router.use('/dynamic-form', dynamicFormRoutes);
router.use('/unitGroup',unitGroupRoutes)
router.use('/unitDefinition',unitDefinitionRoutes)

router.use('/*', endpointNotFound);


export default router;