import { TCoupon } from "./coupon.schema";

export type TCouponEvents = {
    'coupon.created': TCoupon;
    'coupon.updated': {
        prev: TCoupon;
        next: TCoupon;
    };
    'coupon.deleted': {
        id: string;
        code: string;
    };
    'coupon.used': {
        id: string;
        code: string;
        userId: string;
    };
};
