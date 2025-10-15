-- Fix infinite recursion in user_roles RLS policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Owners can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Tenant admins can view tenant roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

-- Create new policies using security definer functions
CREATE POLICY "Owners can manage all roles" 
ON public.user_roles
FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

CREATE POLICY "Tenant admins can view tenant roles" 
ON public.user_roles
FOR SELECT
USING (
  public.is_tenant_admin(auth.uid(), tenant_id) 
  OR auth.uid() = user_id
);

CREATE POLICY "Users can view own roles" 
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);