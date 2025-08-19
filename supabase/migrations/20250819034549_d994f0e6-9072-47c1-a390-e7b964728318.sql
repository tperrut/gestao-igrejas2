-- Fix Member Personal Information Security Vulnerability
-- Remove overly permissive policy and restrict access properly

-- Drop the overly broad policy that allows any authenticated user to view all member records
DROP POLICY IF EXISTS "Limited member info for app operations" ON public.members;

-- Add a secure policy for admins to view all member records
CREATE POLICY "Admins can view all member records" ON public.members
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- The existing "Users can view their own member record" policy remains and is secure
-- It only allows users to see their own record based on email match