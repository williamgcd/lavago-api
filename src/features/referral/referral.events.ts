import { TReferral } from './referral.schema';

export type TReferralEvents = {
    'referral.created': TReferral;
    'referral.updated': { prev: TReferral; next: TReferral };
    'referral.deleted': { id: string; referrerUserId: string; referredUserId: string;};
}
