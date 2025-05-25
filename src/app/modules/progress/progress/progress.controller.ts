import { Request, Response, NextFunction } from 'express';
import { MentorError, MentorResult, JWT } from '../../../utils';
import { Video } from '../../shared/models/video.model';
import { Dal as ProgressDal } from '../../shared/dals/progress.dal';
import { ModifyRequest } from '../../../../../types.d';
import { Progress } from '../../shared/models/progress.model';

export class ProgressController {

  async mergeIntervals(intervals: any[]) {
    if (!Array.isArray(intervals)) {
      return [];
    }

    const cleaned = intervals.filter(i =>
      typeof i?.start === 'number' && typeof i?.end === 'number'
    );

    cleaned.sort((a, b) => a.start - b.start);

    const merged = [];
    for (let intv of cleaned) {
      if (!merged.length || merged[merged.length - 1].end < intv.start) {
        merged.push(intv);
      } else {
        merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, intv.end);
      }
    }

    return merged;
  }

  async removeDuplicateRawIntervals(intervals: { start: number; end: number }[]) {
    const seen = new Set<string>();
    return intervals.filter(({ start, end }) => {
      const key = `${start}-${end}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  generateGraphData(intervals: { start: number; end: number }[], duration: number, chunkSize = 5) {
    const graph: { time: string, status: 'watched' | 'missed' }[] = [];
    const totalChunks = Math.ceil(duration / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      const chunkStart = i * chunkSize;
      const chunkEnd = Math.min((i + 1) * chunkSize, duration);
      const watched = intervals.some(interval => interval.start <= chunkStart && interval.end >= chunkEnd);
      graph.push({
        time: `${chunkStart}-${chunkEnd}`,
        status: watched ? 'watched' : 'missed'
      });
    }
    return graph;
  }

  async addProgressReports(req: ModifyRequest, res: Response, next: NextFunction) {
    try {
      const { userId, videoId, start, end, isFresh } = req.body;

      const video = await Video.findById(videoId);
      if (!video) throw new MentorError(404, "Video not found");

      const videoDuration: any = video.duration;
      const newRawInterval = { start, end };

      let doc = await ProgressDal.findProgess(userId, videoId);

      if (isFresh && doc?.progress === 1) {
        await Progress.deleteOne({ userId, videoId });
        doc = null;
      }

      const tempRaw = [...(doc?.rawIntervals || []), newRawInterval];
      const updatedRaw: any = await this.removeDuplicateRawIntervals(tempRaw);
      const merged = await this.mergeIntervals(updatedRaw);

      const lastWatchedAt = Math.max(...merged.map(i => i.end));


      const graphChunks = this.generateGraphData(merged, videoDuration);
      const allWatched = graphChunks.every(chunk => chunk.status === 'watched');
      const watchedChunks = graphChunks.filter(chunk => chunk.status === 'watched').length;
      const progress = parseFloat((watchedChunks / graphChunks.length).toFixed(2));
      const isEligibleForCertificate = allWatched;

      await ProgressDal.progressUpdate(
        userId,
        videoId,
        lastWatchedAt,
        updatedRaw,
        merged,
        isEligibleForCertificate
      );

      return res.status(200).json({
        status: 200,
        message: "Video progress saved successfully",
        data: {
          progress: (progress * 100).toFixed(2),
          lastWatchedAt,
          intervals: merged,
          rawIntervals: updatedRaw,
          isEligibleForCertificate,
          graph: graphChunks
        }
      });

    } catch (error: unknown) {
      if (error instanceof MentorError) {
        next(new MentorError(error.status, error.message));
      } else {
        next(new MentorError(500, "Unexpected error occurred"));
      }
    }
  }
}

export const ProgressPanelController = new ProgressController();
