-- Remova policies antigas para evitar conflitos
DROP POLICY IF EXISTS "Only admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "User can update own profile (not role)" ON public.profiles;

-- Permitir que apenas admins alterem o campo role (e outros campos) de qualquer perfil
CREATE POLICY "Only admins can update profiles"
  ON public.profiles
  FOR UPDATE
  USING (public.get_current_user_role() = 'admin')
  WITH CHECK (public.get_current_user_role() = 'admin');


