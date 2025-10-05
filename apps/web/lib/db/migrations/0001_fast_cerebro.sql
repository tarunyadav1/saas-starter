CREATE TABLE "test_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" integer NOT NULL,
	"uploaded_by" integer NOT NULL,
	"file_name" text NOT NULL,
	"file_url" text NOT NULL,
	"file_size" integer,
	"mime_type" varchar(100),
	"bucket_path" text NOT NULL,
	"description" text,
	"is_public" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "test_files" ADD CONSTRAINT "test_files_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_files" ADD CONSTRAINT "test_files_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint

-- Enable RLS for test_files table
ALTER TABLE "test_files" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

-- test_files policies: Team members can read, create, update, and delete their team's files

-- Team members can read team files (including public files from other teams)
CREATE POLICY "Team members can read team files" ON "test_files"
    FOR SELECT USING (
        -- Allow team members to read their team's files
        EXISTS (
            SELECT 1 FROM team_members tm
            JOIN users u ON u.id = tm.user_id
            WHERE tm.team_id = test_files.team_id
            AND u.supabase_uid = auth.uid()
        )
        -- Or allow anyone to read public files
        OR test_files.is_public = 1
    );--> statement-breakpoint

-- Team members can create files for their team
CREATE POLICY "Team members can create team files" ON "test_files"
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM team_members tm
            JOIN users u ON u.id = tm.user_id
            WHERE tm.team_id = test_files.team_id
            AND u.supabase_uid = auth.uid()
        )
    );--> statement-breakpoint

-- Team members can update their team's files
CREATE POLICY "Team members can update team files" ON "test_files"
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM team_members tm
            JOIN users u ON u.id = tm.user_id
            WHERE tm.team_id = test_files.team_id
            AND u.supabase_uid = auth.uid()
        )
    );--> statement-breakpoint

-- Team members can delete their team's files
CREATE POLICY "Team members can delete team files" ON "test_files"
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM team_members tm
            JOIN users u ON u.id = tm.user_id
            WHERE tm.team_id = test_files.team_id
            AND u.supabase_uid = auth.uid()
        )
    );--> statement-breakpoint

-- Add performance indexes for test_files
CREATE INDEX IF NOT EXISTS "idx_test_files_team_id" ON "test_files"("team_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_test_files_uploaded_by" ON "test_files"("uploaded_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_test_files_created_at" ON "test_files"("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_test_files_public" ON "test_files"("is_public") WHERE "is_public" = 1;--> statement-breakpoint

-- Create test-files storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('test-files', 'test-files', false, 52428800, ARRAY['image/*', 'video/*', 'audio/*', 'application/pdf', 'text/*'])
ON CONFLICT (id) DO NOTHING;--> statement-breakpoint

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

-- Storage RLS policies for test-files bucket

-- Team members can upload files to their team folder
CREATE POLICY "Team members can upload test files" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'test-files' AND
    EXISTS (
        SELECT 1 FROM team_members tm
        JOIN users u ON u.id = tm.user_id
        WHERE tm.team_id = (string_to_array(name, '/'))[1]::integer
        AND u.supabase_uid = auth.uid()
    )
);--> statement-breakpoint

-- Team members can view their team's files (plus public files)
CREATE POLICY "Team members can view test files" ON storage.objects
FOR SELECT USING (
    bucket_id = 'test-files' AND (
        -- Team members can see their team's files
        EXISTS (
            SELECT 1 FROM team_members tm
            JOIN users u ON u.id = tm.user_id
            WHERE tm.team_id = (string_to_array(name, '/'))[1]::integer
            AND u.supabase_uid = auth.uid()
        )
        -- Or anyone can see public files
        OR EXISTS (
            SELECT 1 FROM test_files tf
            WHERE tf.bucket_path = name
            AND tf.is_public = 1
        )
    )
);--> statement-breakpoint

-- Team members can update their team's files
CREATE POLICY "Team members can update test files" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'test-files' AND
    EXISTS (
        SELECT 1 FROM team_members tm
        JOIN users u ON u.id = tm.user_id
        WHERE tm.team_id = (string_to_array(name, '/'))[1]::integer
        AND u.supabase_uid = auth.uid()
    )
);--> statement-breakpoint

-- Team members can delete their team's files
CREATE POLICY "Team members can delete test files" ON storage.objects
FOR DELETE USING (
    bucket_id = 'test-files' AND
    EXISTS (
        SELECT 1 FROM team_members tm
        JOIN users u ON u.id = tm.user_id
        WHERE tm.team_id = (string_to_array(name, '/'))[1]::integer
        AND u.supabase_uid = auth.uid()
    )
);