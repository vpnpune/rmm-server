import express from 'express';
import userRoutes from './users.route';
import authenticationRoutes from './authenticate.route';
import interceptor from './../authentication-interceptor';
import containerRoutes from './container.route';

const router = express.Router();
router.use('/authenticate', authenticationRoutes);
//router.use(interceptor);

//All routers should be attached after this only
router.use('/users', userRoutes);
router.use('/container', containerRoutes);

export default router;