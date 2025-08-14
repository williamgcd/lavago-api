import { z } from 'zod';

export const ContextRequest = z.object({
    phone: z.string(),
    session_id: z.string().optional(),
    current_step: z.string().optional(),
    // ManyChat fields with api_ prefix
    api_selected_address_id: z.string().optional(),
    api_selected_vehicle_id: z.string().optional(),
    api_selected_timeslot: z.string().optional(),
    api_booking_count: z.number().optional(),
    api_has_water: z.boolean().optional(),
    api_is_building: z.boolean().optional(),
    api_total_price: z.number().optional(),
    api_payment_method: z.string().optional(),
});

export type TContextRequest = z.infer<typeof ContextRequest>;

export const ContextUpdate = z.object({
    phone: z.string(),
    session_id: z.string(),
    updates: z.object({
        address: z.object({
            zip_code: z.string().optional(),
            street: z.string().optional(),
            number: z.string().optional(),
            complement: z.string().optional(),
            neighborhood: z.string().optional(),
            has_water: z.boolean().optional(),
            is_building: z.boolean().optional(),
        }).optional(),
        vehicle: z.object({
            size: z.string().optional(),
            brand: z.string().optional(),
            model: z.string().optional(),
            plate: z.string().optional(),
            color: z.string().optional(),
        }).optional(),
        user: z.object({
            name: z.string().optional(),
            email: z.string().optional(),
            document: z.string().optional(),
        }).optional(),
        booking: z.object({
            timeslot: z.string().optional(),
            date: z.string().optional(),
        }).optional(),
    }),
});

export type TContextUpdate = z.infer<typeof ContextUpdate>;

export interface UserContext {
    user: {
        id: string;
        name: string | null;
        isNew: boolean;
        phone: string;
        email: string | null;
        document: string | null;
    };
    addresses: Array<{
        id: string;
        label: string;
        hasWaterAccess: boolean;
        isBuilding: boolean;
        isSupported: boolean;
    }>;
    vehicles: Array<{
        id: string;
        size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
        type: string | null;
        brand: string | null;
        model: string | null;
    }>;
    bookings: {
        active: Array<any>;  // Define proper Booking type
        history: Array<any>; // Define proper Booking type
    };
    ratings: {
        given: Array<any>;   // Define proper Rating type
        received: Array<any>;// Define proper Rating type
    };
    wallet: {
        balance: number;
        pendingBalance: number;
    };
    referrals: {
        code: string;
        successful: boolean;
        pendingReward: boolean;
    };
    availableProducts: Array<{
        id: string;
        name: string;
        requiresWater: boolean;
        availableForVehicleSizes: string[];
    }>;
    availableTimeslots: Array<{
        date: string;
        slots: string[];
    }>;
}