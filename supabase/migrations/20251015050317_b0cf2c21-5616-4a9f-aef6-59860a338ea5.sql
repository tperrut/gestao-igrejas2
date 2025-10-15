
-- Drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "Owners can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Tenant admins can view tenant roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

-- Create a simple SECURITY DEFINER function to check user roles without RLS
CREATE OR REPLACE FUNCTION public.check_user_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role::text = _role
  )
$$;

-- Create a function to check if user is owner (has admin role in default tenant)
CREATE OR REPLACE FUNCTION public.user_is_owner(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role::text = 'admin'
    AND tenant_id = '00000000-0000-0000-0000-000000000001'::uuid
  )
$$;

-- Now create simple RLS policies using these functions
CREATE POLICY "Owners can manage all roles" 
ON public.user_roles
FOR ALL
USING (public.user_is_owner(auth.uid()))
WITH CHECK (public.user_is_owner(auth.uid()));

CREATE POLICY "Admins can view all tenant roles" 
ON public.user_roles
FOR SELECT
USING (
  public.check_user_role(auth.uid(), 'admin')
  OR auth.uid() = user_id
);

CREATE POLICY "Users can view own roles" 
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Grant execute permission on the functions
GRANT EXECUTE ON FUNCTION public.check_user_role(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_is_owner(uuid) TO authenticated;
