
import { MentorError } from '../../../utils';
import { Video } from '../models/video.model';
import { Progress } from '../models/progress.model';
import { IVideo } from '../interfaces/video.interface ';


class VideoDal {
    async getVideo(): Promise<IVideo> {
        try {
            const video: any = await Video.find({});
            return video;
        } catch (error: any) {
            console.error('Error creating user:', error);
            throw new MentorError(error.status, 'Failed to create user', error);
        }
    }


    async getVideosProgress(userId: any, videoId: any): Promise<IVideo | any> {
        try {
            const progressDoc = await Progress.findOne({ userId, videoId });

            if (!progressDoc) {
                return {
                    progress: 0,
                    intervals: [],
                    lastWatchedAt: 0,
                    graph: [],
                    isEligibleForCertificate: false
                };
            }

            const video: any = await Video.findById(videoId);
            const durationSec = video?.duration || 600; // fallback duration

            const intervals = progressDoc.intervals ?? [];

            // Step 1: Total watched time
            const totalWatched = intervals.reduce(
                (sum: number, i) => sum + (i.end - i.start),
                0
            );
            const progress = ((totalWatched / durationSec) * 100).toFixed(2);

            // Step 2: Generate graph chunks in 5-second steps
            const chunkSize = 5;
            const graph: { time: string; status: "watched" | "missed" }[] = [];

            for (let i = 0; i < durationSec; i += chunkSize) {
                const chunkStart = i;
                const chunkEnd = Math.min(i + chunkSize, durationSec);

                const isWatched = intervals.some(interval => {
                    return (
                        interval.start < chunkEnd &&
                        interval.end > chunkStart
                    );
                });

                graph.push({
                    time: `${chunkStart}-${chunkEnd}`,
                    status: isWatched ? 'watched' : 'missed'
                });
            }

            return {
                progress,
                intervals,
                // rawIntervals: progressDoc.rawIntervals,
                lastWatchedAt: progressDoc.lastWatchedAt,
                isEligibleForCertificate: progressDoc.isEligibleForCertificate,
                graph
            };

        } catch (error: any) {
            console.error('Error in getVideoProgress:', error);
            throw new MentorError(error.status, 'Failed to fetch video progress', error);
        }
    }




}
export const Dal = new VideoDal();