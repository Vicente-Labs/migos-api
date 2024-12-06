CREATE TYPE "public"."member_role" AS ENUM('ADMIN', 'MEMBER');--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "role" "member_role" DEFAULT 'MEMBER' NOT NULL;--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "gift_tip" text;