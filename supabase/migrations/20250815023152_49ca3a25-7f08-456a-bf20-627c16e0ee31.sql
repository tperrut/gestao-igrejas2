-- Fix Member Data Exposure: Update RLS policies for members table
-- Drop the overly permissive policy that allows members to view their own records
DROP POLICY IF EXISTS "Members view own member record" ON public.members;

-- Keep only admin access to members table for proper security
-- The existing "Admins manage members" policy already handles admin access

-- Add audit logging function for member data access
CREATE OR REPLACE FUNCTION public.log_member_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Log member data access for audit purposes
  INSERT INTO public.security_logs (
    user_id,
    action,
    table_name,
    record_id,
    timestamp
  ) VALUES (
    auth.uid(),
    TG_OP,
    'members',
    COALESCE(NEW.id, OLD.id),
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create security_logs table if it doesn't exist
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

-- Create trigger for member access logging
DROP TRIGGER IF EXISTS member_access_audit ON public.members;
CREATE TRIGGER member_access_audit
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.log_member_access();