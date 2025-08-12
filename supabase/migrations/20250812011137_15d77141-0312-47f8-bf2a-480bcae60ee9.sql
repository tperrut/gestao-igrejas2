-- Fix RLS policies by removing hardcoded emails and using proper role-based access control

-- Drop existing policies with hardcoded emails
DROP POLICY IF EXISTS "Admin can manage loans" ON public.loans;
DROP POLICY IF EXISTS "Admin can manage members" ON public.members;
DROP POLICY IF EXISTS "Admin can manage books simple" ON public.books;

-- Remove redundant policies on books table
DROP POLICY IF EXISTS "Allow public read access to books" ON public.books;
DROP POLICY IF EXISTS "Everyone can view books" ON public.books;
DROP POLICY IF EXISTS "Everyone can view books simple" ON public.books;

-- Create proper role-based RLS policies for loans
CREATE POLICY "Admins can manage all loans" 
ON public.loans 
FOR ALL 
USING (get_current_user_role() = 'admin');

CREATE POLICY "Members can view their own loans" 
ON public.loans 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.members m 
    WHERE m.id = loans.member_id 
    AND m.email = (auth.jwt() ->> 'email')
  )
);

-- Create proper role-based RLS policies for members
CREATE POLICY "Admins can manage all members" 
ON public.members 
FOR ALL 
USING (get_current_user_role() = 'admin');

CREATE POLICY "Members can view their own profile" 
ON public.members 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  members.email = (auth.jwt() ->> 'email')
);

-- Create proper role-based RLS policies for books (consolidated)
CREATE POLICY "Everyone can view books" 
ON public.books 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage books" 
ON public.books 
FOR INSERT, UPDATE, DELETE 
USING (get_current_user_role() = 'admin');