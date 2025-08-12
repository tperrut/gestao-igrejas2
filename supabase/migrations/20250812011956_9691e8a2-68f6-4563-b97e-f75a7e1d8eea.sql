-- Idempotent RLS setup: drop then recreate standardized policies

-- Loans
DROP POLICY IF EXISTS "Admins manage loans" ON public.loans;
DROP POLICY IF EXISTS "Members view own loans" ON public.loans;

CREATE POLICY "Admins manage loans"
ON public.loans
FOR ALL
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

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

-- Members
DROP POLICY IF EXISTS "Admins manage members" ON public.members;
DROP POLICY IF EXISTS "Members view own member record" ON public.members;

CREATE POLICY "Admins manage members"
ON public.members
FOR ALL
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Members view own member record"
ON public.members
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND members.email = (auth.jwt() ->> 'email')
);

-- Books
DROP POLICY IF EXISTS "Public read books" ON public.books;
DROP POLICY IF EXISTS "Admins insert books" ON public.books;
DROP POLICY IF EXISTS "Admins update books" ON public.books;
DROP POLICY IF EXISTS "Admins delete books" ON public.books;

CREATE POLICY "Public read books"
ON public.books
FOR SELECT
USING (true);

CREATE POLICY "Admins insert books"
ON public.books
FOR INSERT
WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Admins update books"
ON public.books
FOR UPDATE
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Admins delete books"
ON public.books
FOR DELETE
USING (get_current_user_role() = 'admin');