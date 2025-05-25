import { Progress } from '../models/progress.model';
import { IProgress } from '../interfaces/progess.interface';
import { MentorError } from '../../../utils';
class ProgessDal {
    async progressUpdate(userId: any, videoId: any, lastWatchedAt: any, rawIntervals: any, intervals: any, isEligibleForCertificate: any) {

        return Progress.findOneAndUpdate(

            { userId, videoId },
            {
                $set: {
                    lastWatchedAt,
                    rawIntervals: rawIntervals,
                    intervals: intervals,
                    isEligibleForCertificate: isEligibleForCertificate,
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );

    }


    async findProgess(userId: any, videoId: any): Promise<IProgress | any> {
        try {

            let result: any = await Progress.findOne({ userId, videoId });

            return result
        } catch (error: any) {
            console.error('Error creating user:', error);
            throw new MentorError(error.status, error.message);
        }
    }

}
export const Dal = new ProgessDal();