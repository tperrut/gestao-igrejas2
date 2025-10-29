-- Limpeza total
DROP POLICY IF EXISTS "Owners can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all tenant roles" ON public.user_roles;
DROP POLICY IF EXISTS "Tenant admins can view tenant roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Default tenant admins can manage all roles" ON public.user_roles;

-- Policies seguras e diretas:
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
      AND ur.tenant_id = '00000000-0000-0000-0000-000000000001'::uuid
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role::text = 'admin'
      AND ur.tenant_id = '00000000-0000-0000-0000-000000000001'::uuid
  )
);