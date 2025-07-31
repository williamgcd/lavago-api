import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";

export const USER_ROLES = ['CLIENT', 'WASHER', 'ADMIN', 'SUPER'] as const;
export const USER_DOCUMENT_TYPES = ['cpf'] as const;
    
export const users = sqliteTable('users', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),

    phone: text('phone', { length: 15 }).notNull().unique(),
    phoneVerifiedAt: integer('phone_verified_at', { mode: 'timestamp' }),
	phoneOtp: text('phone_otp', { length: 10 }),
	phoneOtpDate: integer('phone_otp_date', { mode: 'timestamp' }),

    name: text('name', { length: 255 }),
	email: text('email', { length: 255 }).unique(),

    document: text('document', { length: 20 }),
    documentType: text('document_type', { enum: USER_DOCUMENT_TYPES }).default('cpf'),

    referralCode: text('referral_code', { length: 6 }).$defaultFn(() => {
        return generatorUtils.generateReferralCode(6);
    }),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TUserRole = (typeof USER_ROLES)[number];
export type TUserDocumentType = (typeof USER_DOCUMENT_TYPES)[number];
export type TUser = typeof users.$inferSelect;