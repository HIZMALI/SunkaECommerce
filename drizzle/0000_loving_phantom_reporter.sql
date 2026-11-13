CREATE TABLE `Category` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`titleTr` text NOT NULL,
	`description` text NOT NULL,
	`descriptionTr` text NOT NULL,
	`image` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Company` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`country` text NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`phone` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ContactSubmission` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`company` text NOT NULL,
	`email` text NOT NULL,
	`message` text NOT NULL,
	`createdAt` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Order` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`company` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`country` text NOT NULL,
	`shippingAddress` text NOT NULL,
	`billingAddress` text NOT NULL,
	`notes` text NOT NULL,
	`status` text DEFAULT 'RECORDED' NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`totalCents` integer NOT NULL,
	`idempotencyKey` text NOT NULL,
	`createdAt` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Order_idempotencyKey_unique` ON `Order` (`idempotencyKey`);--> statement-breakpoint
CREATE TABLE `OrderItem` (
	`id` text PRIMARY KEY NOT NULL,
	`orderId` text NOT NULL,
	`productId` text NOT NULL,
	`variantId` text NOT NULL,
	`title` text NOT NULL,
	`titleTr` text NOT NULL,
	`variantLabel` text NOT NULL,
	`image` text NOT NULL,
	`quantity` integer NOT NULL,
	`unitCents` integer NOT NULL,
	`totalCents` integer NOT NULL,
	FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `PricingTier` (
	`id` text PRIMARY KEY NOT NULL,
	`productId` text NOT NULL,
	`minQty` integer NOT NULL,
	`discountBps` integer NOT NULL,
	FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `PricingTier_productId_minQty_key` ON `PricingTier` (`productId`,`minQty`);--> statement-breakpoint
CREATE TABLE `Product` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`sku` text NOT NULL,
	`title` text NOT NULL,
	`titleTr` text NOT NULL,
	`description` text NOT NULL,
	`descriptionTr` text NOT NULL,
	`categoryId` text NOT NULL,
	`subcategory` text NOT NULL,
	`industry` text NOT NULL,
	`saleMode` text DEFAULT 'STANDARD_ORDER' NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`baseCents` integer NOT NULL,
	`moq` integer DEFAULT 100 NOT NULL,
	`packMultiple` integer DEFAULT 50 NOT NULL,
	`specs` text NOT NULL,
	`sourceUrl` text NOT NULL,
	`updatedAt` text NOT NULL,
	FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Product_slug_unique` ON `Product` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `Product_sku_unique` ON `Product` (`sku`);--> statement-breakpoint
CREATE TABLE `ProductImage` (
	`id` text PRIMARY KEY NOT NULL,
	`productId` text NOT NULL,
	`src` text NOT NULL,
	`alt` text NOT NULL,
	`position` integer NOT NULL,
	FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ProductVariant` (
	`id` text PRIMARY KEY NOT NULL,
	`productId` text NOT NULL,
	`sku` text NOT NULL,
	`shape` text NOT NULL,
	`size` text NOT NULL,
	`finish` text NOT NULL,
	`color` text NOT NULL,
	`thickness` text NOT NULL,
	`pack` integer DEFAULT 50 NOT NULL,
	`adjustmentCents` integer DEFAULT 0 NOT NULL,
	`demoCapacity` integer DEFAULT 10000 NOT NULL,
	FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ProductVariant_sku_unique` ON `ProductVariant` (`sku`);--> statement-breakpoint
CREATE TABLE `QuoteRequest` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text,
	`family` text NOT NULL,
	`application` text NOT NULL,
	`shape` text NOT NULL,
	`dimensions` text NOT NULL,
	`thickness` text NOT NULL,
	`finish` text NOT NULL,
	`quantity` integer NOT NULL,
	`country` text NOT NULL,
	`company` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`notes` text NOT NULL,
	`status` text DEFAULT 'NEW' NOT NULL,
	`response` text DEFAULT '' NOT NULL,
	`createdAt` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `SeedState` (
	`id` text PRIMARY KEY NOT NULL,
	`appliedAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Session` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expiresAt` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`passwordHash` text NOT NULL,
	`role` text DEFAULT 'PENDING_BUYER' NOT NULL,
	`companyId` text,
	FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `User_email_unique` ON `User` (`email`);--> statement-breakpoint
CREATE TABLE `WholesaleApplication` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`company` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`country` text NOT NULL,
	`businessType` text NOT NULL,
	`monthlyVolume` text NOT NULL,
	`interests` text NOT NULL,
	`notes` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`createdAt` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
