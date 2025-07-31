CREATE TABLE `addresses` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`property_id` text,
	`label` text(255) NOT NULL,
	`street` text(255) NOT NULL,
	`number` text(255) NOT NULL,
	`complement` text(255),
	`neighborhood` text(255) NOT NULL,
	`city` text(255) NOT NULL,
	`state` text(255) NOT NULL,
	`country` text(255) DEFAULT 'BR' NOT NULL,
	`zip` text(255) NOT NULL,
	`notes` text(255),
	`lat` real,
	`lng` real,
	`is_default` integer DEFAULT false NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `booking_actions` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL,
	`message` text(255) NOT NULL,
	`metadata` text,
	`created_by` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `booking_ratings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`booking_id` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`is_same_day_booking` integer DEFAULT false NOT NULL,
	`is_one_time_booking` integer DEFAULT false NOT NULL,
	`rescheduled_from_id` text,
	`date` integer,
	`date_it_started` integer,
	`date_it_ended` integer,
	`address_id` text,
	`address` text(255),
	`address_lat` real,
	`address_lng` real,
	`address_notes` text(255),
	`vehicle_id` text,
	`vehicle` text(255),
	`client_id` text,
	`client_name` text(255),
	`client_phone` text(255),
	`washer_id` text,
	`washer_name` text(255),
	`washer_phone` text(255),
	`washer_rating` integer,
	`trainer_id` text,
	`trainer_name` text(255),
	`trainer_phone` text(255),
	`trainee_rating` integer,
	`ticket_id` text,
	`product_id` text,
	`payment_id` text,
	`subscription_id` text,
	`price` integer NOT NULL,
	`price_discount` integer NOT NULL,
	`price_total` integer NOT NULL,
	`washer_quota` integer DEFAULT 0,
	`trainee_quota` integer DEFAULT 0,
	`client_notes` text(255),
	`washer_notes` text(255),
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`washer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`trainer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`chat_id` text NOT NULL,
	`type` text NOT NULL,
	`actor` text(255) NOT NULL,
	`content` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chat_users` (
	`id` text PRIMARY KEY NOT NULL,
	`chat_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chats` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'OPEN' NOT NULL,
	`object` text(255) NOT NULL,
	`object_id` text NOT NULL,
	`title` text(255) NOT NULL,
	`description` text(255) NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `coupons` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text(255) NOT NULL,
	`discount_type` text DEFAULT 'PERCENTAGE' NOT NULL,
	`discount_value` real DEFAULT 0 NOT NULL,
	`begins_at` integer,
	`expires_at` integer,
	`usage_limit` integer DEFAULT 0 NOT NULL,
	`usage_count` integer DEFAULT 0 NOT NULL,
	`usage_user_id` text,
	`created_by` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`usage_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `coupons_code_unique` ON `coupons` (`code`);--> statement-breakpoint
CREATE TABLE `geofencing_checks` (
	`id` text PRIMARY KEY NOT NULL,
	`zip` text(255) NOT NULL,
	`is_supported` integer,
	`washer_count` integer DEFAULT 0 NOT NULL,
	`lat` real,
	`lng` real,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `geofencing_checks_zip_unique` ON `geofencing_checks` (`zip`);--> statement-breakpoint
CREATE TABLE `geofencing_cities` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text(255) NOT NULL,
	`is_supported` integer,
	`zip_range_start` text(255) NOT NULL,
	`zip_range_end` text(255) NOT NULL,
	`country` text(255) DEFAULT 'BR' NOT NULL,
	`state` text(255) NOT NULL,
	`city` text(255) NOT NULL,
	`lat` real,
	`lng` real,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `geofencing_cities_identifier_unique` ON `geofencing_cities` (`identifier`);--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`payment_provider` text NOT NULL,
	`payment_provider_id` text NOT NULL,
	`payment_method` text NOT NULL,
	`amount` integer NOT NULL,
	`currency` text DEFAULT 'BRL' NOT NULL,
	`is_pre_authorization` integer DEFAULT false NOT NULL,
	`pre_authorization_id` text,
	`pre_authorization_expires_at` integer,
	`retry_count` integer DEFAULT 0 NOT NULL,
	`retry_attempt_at` integer,
	`retry_expires_at` integer,
	`description` text,
	`metadata` text,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `product_prices` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`vehicle_type` text NOT NULL,
	`price` integer NOT NULL,
	`washer_quota` integer DEFAULT 0 NOT NULL,
	`trainee_quota` integer DEFAULT 0 NOT NULL,
	`duration` integer DEFAULT 60 NOT NULL,
	`duration_estimate` text DEFAULT '60-90 min' NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`mode` text NOT NULL,
	`name` text(255) NOT NULL,
	`description` text(255),
	`price` integer NOT NULL,
	`washer_quota` integer DEFAULT 0 NOT NULL,
	`trainee_quota` integer DEFAULT 0 NOT NULL,
	`duration` integer DEFAULT 60 NOT NULL,
	`duration_estimate` text DEFAULT '60-90 min' NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `property_hours` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`day_of_week` text NOT NULL,
	`hour_start` integer NOT NULL,
	`hour_end` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`description` text(255),
	`street` text(255) NOT NULL,
	`number` text(255) NOT NULL,
	`complement` text(255),
	`neighborhood` text(255) NOT NULL,
	`city` text(255) NOT NULL,
	`state` text(255) NOT NULL,
	`country` text(255) DEFAULT 'BR' NOT NULL,
	`zip` text(255) NOT NULL,
	`lat` real,
	`lng` real,
	`is_supported` integer,
	`agreed_discount` integer DEFAULT 0 NOT NULL,
	`agreed_cashback_per_booking` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` text PRIMARY KEY NOT NULL,
	`referrer_user_id` text NOT NULL,
	`referred_user_id` text NOT NULL,
	`value` integer NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`referrer_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`referred_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`product_id` text NOT NULL,
	`vehicle_id` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`recurrence` text NOT NULL,
	`discount_percentage` real NOT NULL,
	`payment_provider` text NOT NULL,
	`payment_provider_id` text NOT NULL,
	`last_booking_date` integer,
	`next_booking_date` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`assigned_to` text,
	`assigned_at` integer,
	`object` text(255),
	`object_id` text,
	`title` text(255) NOT NULL,
	`description` text NOT NULL,
	`status` text DEFAULT 'OPEN' NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`value` integer NOT NULL,
	`description` text(255),
	`object` text(255),
	`object_id` text,
	`object_reference` text(255),
	`status` text DEFAULT 'PENDING' NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`phone` text(15) NOT NULL,
	`phone_verified_at` integer,
	`phone_otp` text(10),
	`phone_otp_date` integer,
	`name` text(255),
	`email` text(255),
	`document` text(20),
	`document_type` text DEFAULT 'cpf',
	`referral_code` text(6),
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_phone_unique` ON `users` (`phone`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`plate` text(10),
	`brand` text(20),
	`model` text(20),
	`color` text(20),
	`year` integer,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`balance` integer DEFAULT 0 NOT NULL,
	`currency` text(3) DEFAULT 'BRL' NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `washer_hours` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`day_of_week` text NOT NULL,
	`hour_start` integer NOT NULL,
	`hour_end` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `washer_products` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`product_id` text NOT NULL,
	`is_preferred` integer DEFAULT false NOT NULL,
	`last_used_at` integer,
	`trained_by` text,
	`trained_at` integer,
	`licensed_by` text,
	`licensed_at` integer,
	`avg_duration` integer DEFAULT 0 NOT NULL,
	`avg_rating` real DEFAULT 0 NOT NULL,
	`experience_level` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`trained_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`licensed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `washer_slot_exceptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`is_available` integer DEFAULT true NOT NULL,
	`interval_start` integer NOT NULL,
	`interval_end` integer NOT NULL,
	`type` text DEFAULT 'custom' NOT NULL,
	`reason` text(255) NOT NULL,
	`justification` text(255) NOT NULL,
	`created_by` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `washer_slots` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`is_available` integer DEFAULT true NOT NULL,
	`interval_start` integer NOT NULL,
	`interval_end` integer NOT NULL,
	`type` text DEFAULT 'custom' NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `washers` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`rating` real DEFAULT 0 NOT NULL,
	`last_lat` real,
	`last_lng` real,
	`last_seen_at` integer,
	`base_lat` real,
	`base_lng` real,
	`base_radius` real DEFAULT 1000 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
