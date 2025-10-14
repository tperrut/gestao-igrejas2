-- Phase 1: Create Proper Role Management System

-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'member');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tenant_id)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Migrate existing data from profiles to user_roles
INSERT INTO public.user_roles (user_id, tenant_id, role)
SELECT 
  p.id,
  p.tenant_id,
  CASE 
    WHEN p.role = 'admin' THEN 'admin'::app_role
    ELSE 'member'::app_role
  END
FROM profiles p
WHERE p.id IS NOT NULL
ON CONFLICT (user_id, tenant_id) DO NOTHING;

-- 4. Migrate data from tenant_users to user_roles
INSERT INTO public.user_roles (user_id, tenant_id, role)
SELECT 
  tu.user_id,
  tu.tenant_id,
  CASE 
    WHEN tu.role = 'owner' THEN 'owner'::app_role
    WHEN tu.role = 'admin' THEN 'admin'::app_role
    ELSE 'member'::app_role
  END
FROM tenant_users tu
WHERE tu.user_id IS NOT NULL
ON CONFLICT (user_id, tenant_id) DO UPDATE SET role = EXCLUDED.role;

-- 5. Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role_in_tenant(
  _user_id UUID,
  _tenant_id UUID,
  _role app_role
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND tenant_id = _tenant_id
      AND role = _role
  )
$$;

-- 6. Update has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 7. Update is_admin function
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = is_admin.user_id
      AND role IN ('admin'::app_role, 'owner'::app_role)
  )
$$;

-- 8. Update is_owner function
CREATE OR REPLACE FUNCTION public.is_owner(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = is_owner.user_id
      AND role = 'owner'::app_role
  )
$$;

-- 9. Update is_tenant_admin function
CREATE OR REPLACE FUNCTION public.is_tenant_admin(user_id uuid, tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = is_tenant_admin.user_id
      AND user_roles.tenant_id = is_tenant_admin.tenant_id
      AND role IN ('admin'::app_role, 'owner'::app_role)
  )
$$;

-- 10. Update get_current_user_role function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT role::text 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
    AND tenant_id = public.get_current_tenant_id()
  LIMIT 1
$$;

-- 11. Create RLS policies for user_roles table
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Owners can manage all roles"
ON public.user_roles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'owner'::app_role
  )
);

CREATE POLICY "Tenant admins can view tenant roles"
ON public.user_roles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() 
      AND ur.tenant_id = user_roles.tenant_id
      AND ur.role IN ('admin'::app_role, 'owner'::app_role)
  )
);

-- 12. Update handle_new_user trigger to use user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  default_tenant_id UUID := '00000000-0000-0000-0000-000000000001'::uuid;
BEGIN
  -- Insert profile without role
  INSERT INTO public.profiles (id, email, name, tenant_id)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'Usuário'),
    default_tenant_id
  );
  
  -- Assign to user_roles table
  INSERT INTO public.user_roles (user_id, tenant_id, role)
  VALUES (NEW.id, default_tenant_id, 'member'::app_role);
  
  -- Also add to tenant_users for backward compatibility
  INSERT INTO public.tenant_users (user_id, tenant_id, role, status)
  VALUES (NEW.id, default_tenant_id, 'member', 'active');
  
  RETURN NEW;
END;
$$;

-- 13. Add updated_at trigger for user_roles
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 14. Drop role column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;