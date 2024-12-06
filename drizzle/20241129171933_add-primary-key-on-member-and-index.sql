ALTER TABLE "member" ADD PRIMARY KEY ("user_id");--> statement-breakpoint
ALTER TABLE "member" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_member_user_group" ON "member" USING btree ("user_id","group_id");