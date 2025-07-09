DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
DROP INDEX "channel_server_idx";--> statement-breakpoint
DROP INDEX "member_user_idx";--> statement-breakpoint
DROP INDEX "member_server_idx";--> statement-breakpoint
DROP INDEX "member_serverId_userId_unique";--> statement-breakpoint
DROP INDEX "server_owner_idx";--> statement-breakpoint
ALTER TABLE `member` ALTER COLUMN "member_role" TO "member_role" text NOT NULL DEFAULT 'GUEST';--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `channel_server_idx` ON `channel` (`server_id`);--> statement-breakpoint
CREATE INDEX `member_user_idx` ON `member` (`user_id`);--> statement-breakpoint
CREATE INDEX `member_server_idx` ON `member` (`server_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `member_serverId_userId_unique` ON `member` (`server_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `server_owner_idx` ON `server` (`owner_id`);