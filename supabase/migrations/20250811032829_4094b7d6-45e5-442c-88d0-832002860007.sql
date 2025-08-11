-- Remover políticas problemáticas que podem causar recursão infinita
DROP POLICY IF EXISTS "Members can view their own loans" ON public.loans;
DROP POLICY IF EXISTS "Admins can manage all members" ON public.members;
DROP POLICY IF EXISTS "Users can view their own member profile" ON public.members;
DROP POLICY IF EXISTS "Only admins can manage loans" ON public.loans;
DROP POLICY IF EXISTS "Only admins can manage books" ON public.books;
DROP POLICY IF EXISTS "Only authenticated admins can manage books" ON public.books;

-- Recriar políticas mais simples e seguras para evitar recursão
-- Política para loans - apenas admin pode ver e gerenciar
CREATE POLICY "Admin can manage loans" 
ON public.loans 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'thi.perrut@gmail.com'
  )
);

-- Política para members - apenas admin pode ver e gerenciar
CREATE POLICY "Admin can manage members" 
ON public.members 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'thi.perrut@gmail.com'
  )
);

-- Política para books - admin pode gerenciar, todos podem ver
CREATE POLICY "Everyone can view books simple" 
ON public.books 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage books simple" 
ON public.books 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'thi.perrut@gmail.com'
  )
);