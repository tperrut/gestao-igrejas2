-- 1. Remova todas as policies antigas da tabela user_roles
DROP POLICY IF EXISTS "Owners can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all tenant roles" ON public.user_roles;
DROP POLICY IF EXISTS "Tenant admins can view tenant roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Default tenant admins can manage all roles" ON public.user_roles;

-- 2. Crie apenas policies diretas, sem função, para user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Default tenant admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role::text = 'admin'
        AND ur.tenant_id = '00000000-0000-0000-0000-000000000001'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role::text = 'admin'
        AND ur.tenant_id = '00000000-0000-0000-0000-000000000001'
    )
  );

-- 3. Garanta que a função is_admin é SECURITY DEFINER e não depende de RLS de user_roles
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
SELECT EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = is_admin.user_id
    AND role = 'admin'
)
$$;

-- 4. (Opcional) Recrie as policies do storage.objects se quiser garantir padronização:
DROP POLICY IF EXISTS "Admins can delete course images" ON storage.objects;
CREATE POLICY "Admins can delete course images"
  ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'course-images'
    AND public.is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "Admins can delete event images" ON storage.objects;
CREATE POLICY "Admins can delete event images"
  ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'event-images'
    AND public.is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "Admins can update course images" ON storage.objects;
CREATE POLICY "Admins can update course images"
  ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'course-images'
    AND public.is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "Admins can update event images" ON storage.objects;
CREATE POLICY "Admins can update event images"
  ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'event-images'
    AND public.is_admin(auth.uid())
  );