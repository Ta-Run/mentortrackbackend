import { Request, Response, NextFunction } from 'express';
import * as express from 'express';
import { VideoPanelController } from './video.controller';
export const router = express.Router();

router.post('/getVideo', (request: Request, response: Response, next: NextFunction) => {
  VideoPanelController.getVideos(request, response, next);
});


router.post('/getVideoProgressReport', (request: Request, response: Response, next: NextFunction) => {
  VideoPanelController.getVideoProgressReport(request, response, next);
});



