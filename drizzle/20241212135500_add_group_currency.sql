CREATE TYPE "public"."currency" AS ENUM('USD', 'EUR', 'BRL');--> statement-breakpoint
ALTER TABLE "groups" ADD COLUMN "currency" "currency" DEFAULT 'USD' NOT NULL;