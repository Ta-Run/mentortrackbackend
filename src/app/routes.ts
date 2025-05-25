import express from 'express';
import userRouter from './modules/user/userRoutes';
import videoRouter from './modules/video/videoRoutes'
import progressRouter from './modules/progress/progressRoutes'
const router = express.Router();
router.use('/user', userRouter);
router.use('/video', videoRouter);
router.use('/progress', progressRouter);


export default router;
