import { Request, Response, NextFunction } from 'express';
import * as express from 'express';
import { ProgressPanelController } from './progress.controller';


export const router = express.Router();

router.post('/addProgressReports', (request: Request, response: Response, next: NextFunction) => {
  ProgressPanelController.addProgressReports(request, response, next);
});
