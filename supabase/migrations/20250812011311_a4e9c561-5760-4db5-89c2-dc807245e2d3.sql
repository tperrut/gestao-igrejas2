-- RLS policy standardization: remove hardcoded emails and use role-based checks

-- 1) Drop existing problematic and redundant policies
DROP POLICY IF EXISTS "Admin can manage loans" ON public.loans;
DROP POLICY IF EXISTS "Admin can manage members" ON public.members;
DROP POLICY IF EXISTS "Admin can manage books simple" ON public.books;
DROP POLICY IF EXISTS "Allow public read access to books" ON public.books;
DROP POLICY IF EXISTS "Everyone can view books" ON public.books;
DROP POLICY IF EXISTS "Everyone can view books simple" ON public.books;

-- 2) Loans policies
-- Admins: full manage
CREATE POLICY "Admins manage loans"
ON public.loans
FOR ALL
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- Members can view their own loans
CREATE POLICY "Members view own loans"
ON public.loans
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.members m
    WHERE m.id = loans.member_id
      AND m.email = (auth.jwt() ->> 'email')
  )
);

-- 3) Members policies
-- Admins: full manage
CREATE POLICY "Admins manage members"
ON public.members
FOR ALL
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- Members can view their own member record by email
CREATE POLICY "Members view own member record"
ON public.members
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND members.email = (auth.jwt() ->> 'email')
);

-- 4) Books policies
-- Public read
CREATE POLICY "Public read books"
ON public.books
FOR SELECT
USING (true);

-- Admins can insert books
CREATE POLICY "Admins insert books"
ON public.books
FOR INSERT
WITH CHECK (get_current_user_role() = 'admin');

-- Admins can update books
CREATE POLICY "Admins update books"
ON public.books
FOR UPDATE
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- Admins can delete books
CREATE POLICY "Admins delete books"
ON public.books
FOR DELETE
USING (get_current_user_role() = 'admin');