import { PAGINATION } from "@/constants";
import { TReferralFindQueryDTO } from "./referral.controller.dto";
import { referralRepository } from "./referral.repository";
import { TReferral } from "./referral.schema";

export const referralService = {
    create: async (data: Omit<Partial<TReferral>, 'id'>): Promise<TReferral> => {
        return await referralRepository.create(data);
    },

    deleteById: async (id: string): Promise<void> => {
        await referralRepository.deleteById(id);
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TReferralFindQueryDTO,
    ): Promise<{ data: TReferral[], total: number }> => {
        return referralRepository.find(limit, page, query);
    },

    findByReferrerUserId: async (
        referrerUserId: string,
        limit?: number,
        page?: number,
        query?: Omit<TReferralFindQueryDTO, 'referrerUserId'>
    ): Promise<{ data: TReferral[], total: number }> => {
        return referralRepository.find(limit, page, { referrerUserId, ...query });
    },

    findByReferredUserId: async (
        referredUserId: string,
        limit?: number,
        page?: number,
        query?: Omit<TReferralFindQueryDTO, 'referredUserId'>
    ): Promise<{ data: TReferral[], total: number }> => {
        return referralRepository.find(limit, page, { referredUserId, ...query });
    },

    getById: async (id: string): Promise<TReferral> => {
        return referralRepository.getById(id);
    },

    updateById: async (id: string, data: Partial<TReferral>): Promise<TReferral> => {
        return referralRepository.updateById(id, data);
    },
};
