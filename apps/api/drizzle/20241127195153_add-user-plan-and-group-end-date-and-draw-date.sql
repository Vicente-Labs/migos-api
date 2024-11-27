CREATE TYPE "public"."plan" AS ENUM('BASIC', 'PRO');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "plan" "plan" DEFAULT 'BASIC' NOT NULL;--> statement-breakpoint
ALTER TABLE "groups" ADD COLUMN "end_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "groups" ADD COLUMN "draw_date" timestamp;