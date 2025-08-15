-- Fix Member Data Exposure: Update RLS policies for members table
-- Drop the overly permissive policy that allows members to view their own records
DROP POLICY IF EXISTS "Members view own member record" ON public.members;

-- Create security_logs table for audit purposes
CREATE TABLE IF NOT EXISTS public.security_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  details jsonb
);

-- Enable RLS on security_logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view security logs
CREATE POLICY "Admins can view security logs" ON public.security_logs
FOR SELECT USING (is_admin(auth.uid()));