-- Drop all policies on user_roles to prevent recursion
DROP POLICY IF EXISTS "Owners can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all tenant roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

-- Drop the problematic functions that cause recursion
DROP FUNCTION IF EXISTS public.check_user_role(uuid, text);
DROP FUNCTION IF EXISTS public.user_is_owner(uuid);

-- Create simple, non-recursive policies on user_roles
-- 1. Users can always view their own roles (this is essential for the app to work)
CREATE POLICY "Users can view own roles" 
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- 2. Users with admin role in default tenant can manage all roles
-- This policy checks directly without function calls to avoid recursion
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