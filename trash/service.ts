import { userService } from '../user/service';
import { addressService } from '../address/service';
import { vehicleService } from '../vehicle/service';
import { bookingService } from '../booking/service';
import { ratingService } from '../rating/service';
import { walletService } from '../wallet/service';
import { referralService } from '../referral/service';
import { productService } from '../product/service';

import type { TContextRequest, TContextUpdate, UserContext } from './types';

export const contextService = {
    /**
     * Gather all context for a user based on phone number
     */
    getUserContext: async (request: TContextRequest): Promise<UserContext> => {
        // Get or create user
        let user;
        try {
            user = await userService.getByPhone(request.phone);
        } catch {
            // Create new user with phone
            user = await userService.create({ phone: request.phone });
        }

        // Gather all related data in parallel
        const [
            addresses,
            vehicles,
            bookings,
            ratings,
            wallet,
            referrals,
            availableProducts,
            availableTimeslots,
        ] = await Promise.all([
            addressService.findByUserId(user.id),
            vehicleService.findByUserId(user.id),
            bookingService.findByUserId(user.id),
            ratingService.findByUserId(user.id),
            walletService.getByUserId(user.id),
            referralService.getByUserId(user.id),
            productService.getAvailable(),
            // This might need more context like date, location
            bookingService.getAvailableTimeslots(),
        ]);

        return {
            user: {
                id: user.id,
                name: user.name,
                isNew: !user.name, // Consider a user new if they don't have a name yet
                phone: user.phone!,
                email: user.email,
                document: user.document,
            },
            addresses: addresses.data.map(addr => ({
                id: addr.id,
                label: addr.label,
                hasWaterAccess: addr.constraints?.hasWaterAccess ?? false,
                isBuilding: addr.constraints?.isBuilding ?? false,
                isSupported: addr.is_supported,
            })),
            vehicles: vehicles.data.map(v => ({
                id: v.id,
                size: v.size,
                type: v.type,
                brand: v.brand,
                model: v.model,
            })),
            bookings: {
                active: bookings.data.filter(b => b.status === 'active'),
                history: bookings.data.filter(b => b.status === 'completed'),
            },
            ratings: {
                given: ratings.given,
                received: ratings.received,
            },
            wallet: {
                balance: wallet.balance,
                pendingBalance: wallet.pending_balance,
            },
            referrals: {
                code: user.referral!,
                successful: referrals.successful,
                pendingReward: referrals.pending_reward,
            },
            availableProducts: availableProducts.map(p => ({
                id: p.id,
                name: p.name,
                requiresWater: p.requires_water,
                availableForVehicleSizes: p.available_sizes,
            })),
            availableTimeslots: availableTimeslots,
        };
    },

    /**
     * Update user context with new information
     */
    updateContext: async (update: TContextUpdate): Promise<void> => {
        const user = await userService.getByPhone(update.phone);
        const updates = update.updates;

        // Process updates in parallel
        await Promise.all([
            // Update user information if provided
            updates.user && userService.update(user.id, updates.user),

            // Create or update address if provided
            updates.address && addressService.createOrUpdate({
                user_id: user.id,
                ...updates.address,
            }),

            // Create or update vehicle if provided
            updates.vehicle && vehicleService.createOrUpdate({
                user_id: user.id,
                ...updates.vehicle,
            }),

            // Update booking information if provided
            updates.booking && bookingService.updateOrCreate({
                user_id: user.id,
                ...updates.booking,
            }),
        ]);
    },
};