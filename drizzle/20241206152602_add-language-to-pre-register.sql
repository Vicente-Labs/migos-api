CREATE TYPE "public"."language" AS ENUM('en-US', 'pt-BR', 'es-ES');--> statement-breakpoint
ALTER TABLE "pre_registers" ADD COLUMN "language" "language" DEFAULT 'en-US' NOT NULL;