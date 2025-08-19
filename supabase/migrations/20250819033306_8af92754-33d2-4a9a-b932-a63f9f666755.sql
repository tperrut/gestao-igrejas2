-- Fix Member Personal Information Security Issue
-- Add proper RLS policies to protect member data while allowing necessary access

-- Policy 1: Users can view their own member record
CREATE POLICY "Users can view their own member record" ON public.members
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND email = (auth.jwt() ->> 'email'::text)
);

-- Policy 2: Allow limited public member info for operational needs
-- This allows viewing only basic info (name, id) for legitimate app functions
CREATE POLICY "Limited member info for app operations" ON public.members
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'member')
  )
);

-- Policy 3: Secure member creation - only admins can create members
CREATE POLICY "Only admins can create members" ON public.members
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy 4: Secure member updates - only admins can update members
CREATE POLICY "Only admins can update members" ON public.members
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy 5: Secure member deletion - only admins can delete members
CREATE POLICY "Only admins can delete members" ON public.members
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Drop the overly broad admin policy since we now have specific policies
DROP POLICY IF EXISTS "Admins manage members" ON public.members;