
-- Remover a política problemática que causa recursão infinita
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Criar função de segurança definer para verificar se o usuário é admin
-- Esta função não causa recursão pois ela própria não usa políticas RLS
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  -- Usar uma consulta direta sem depender de RLS
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Recriar a política usando a função de segurança
CREATE POLICY "Users can view own profile or admins can view all" ON public.profiles
FOR SELECT USING (
  auth.uid() = id OR 
  public.get_current_user_role() = 'admin'
);

-- Certificar que as outras políticas também não causam recursão
-- Atualizar outras políticas que podem ter o mesmo problema
DROP POLICY IF EXISTS "Only authenticated admins can manage books" ON public.books;
CREATE POLICY "Only authenticated admins can manage books" ON public.books
FOR ALL USING (
  auth.uid() IS NOT NULL AND 
  public.get_current_user_role() = 'admin'
);

DROP POLICY IF EXISTS "Admins can manage all members" ON public.members;
CREATE POLICY "Admins can manage all members" ON public.members
FOR ALL USING (
  auth.uid() IS NOT NULL AND 
  public.get_current_user_role() = 'admin'
);

DROP POLICY IF EXISTS "Admins can update pastoral appointments" ON public.pastoral_appointments;
CREATE POLICY "Admins can update pastoral appointments" ON public.pastoral_appointments
FOR UPDATE USING (
  auth.uid() IS NOT NULL AND 
  public.get_current_user_role() = 'admin'
);

-- Atualizar política de visualização de agendamentos pastorais
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.pastoral_appointments;
CREATE POLICY "Users can view their own appointments" ON public.pastoral_appointments
FOR SELECT USING (
  auth.uid() IS NOT NULL AND 
  (member_email = (auth.jwt() ->> 'email'::text) OR
   public.get_current_user_role() = 'admin')
);
