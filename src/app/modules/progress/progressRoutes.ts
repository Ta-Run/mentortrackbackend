import express from 'express';
import { ProgressPanelRouter } from './progress';

const progressRouter = express.Router();

progressRouter.use('/', ProgressPanelRouter);

export default progressRouter;
