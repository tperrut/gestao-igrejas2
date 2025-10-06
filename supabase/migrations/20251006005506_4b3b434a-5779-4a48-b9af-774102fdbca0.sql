-- =====================================================
-- STEP 1: Create fundamental tables
-- =====================================================

-- Create tenants table
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subdomain TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  plan_type TEXT NOT NULL DEFAULT 'basic' CHECK (plan_type IN ('basic', 'premium', 'enterprise')),
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tenant_users table (relationship between tenants and users)
CREATE TABLE public.tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);

-- Enable RLS on new tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_tenants_subdomain ON public.tenants(subdomain);
CREATE INDEX idx_tenants_status ON public.tenants(status);
CREATE INDEX idx_tenant_users_tenant_id ON public.tenant_users(tenant_id);
CREATE INDEX idx_tenant_users_user_id ON public.tenant_users(user_id);
CREATE INDEX idx_tenant_users_role ON public.tenant_users(role);

-- =====================================================
-- STEP 2: Add tenant_id to existing tables
-- =====================================================

-- Add tenant_id to profiles
ALTER TABLE public.profiles ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_profiles_tenant_id ON public.profiles(tenant_id);

-- Add tenant_id to books
ALTER TABLE public.books ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_books_tenant_id ON public.books(tenant_id);

-- Add tenant_id to courses
ALTER TABLE public.courses ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_courses_tenant_id ON public.courses(tenant_id);

-- Add tenant_id to events
ALTER TABLE public.events ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_events_tenant_id ON public.events(tenant_id);

-- Add tenant_id to loans
ALTER TABLE public.loans ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_loans_tenant_id ON public.loans(tenant_id);

-- Add tenant_id to members
ALTER TABLE public.members ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_members_tenant_id ON public.members(tenant_id);

-- Add tenant_id to pastoral_appointments
ALTER TABLE public.pastoral_appointments ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_pastoral_appointments_tenant_id ON public.pastoral_appointments(tenant_id);

-- Add tenant_id to pastoral_schedules
ALTER TABLE public.pastoral_schedules ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_pastoral_schedules_tenant_id ON public.pastoral_schedules(tenant_id);

-- Add tenant_id to reservations
ALTER TABLE public.reservations ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_reservations_tenant_id ON public.reservations(tenant_id);

-- Add tenant_id to security_logs
ALTER TABLE public.security_logs ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_security_logs_tenant_id ON public.security_logs(tenant_id);

-- Add tenant_id to sunday_school tables
ALTER TABLE public.sunday_school_attendance ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_sunday_school_attendance_tenant_id ON public.sunday_school_attendance(tenant_id);

ALTER TABLE public.sunday_school_classes ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_sunday_school_classes_tenant_id ON public.sunday_school_classes(tenant_id);

ALTER TABLE public.sunday_school_class_teachers ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_sunday_school_class_teachers_tenant_id ON public.sunday_school_class_teachers(tenant_id);

ALTER TABLE public.sunday_school_enrollments ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_sunday_school_enrollments_tenant_id ON public.sunday_school_enrollments(tenant_id);

ALTER TABLE public.sunday_school_lessons ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_sunday_school_lessons_tenant_id ON public.sunday_school_lessons(tenant_id);

ALTER TABLE public.sunday_school_teachers ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_sunday_school_teachers_tenant_id ON public.sunday_school_teachers(tenant_id);

-- =====================================================
-- STEP 3: Create database functions
-- =====================================================

-- Function to get current tenant_id from authenticated user
CREATE OR REPLACE FUNCTION public.get_current_tenant_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id 
  FROM public.tenant_users 
  WHERE user_id = auth.uid() 
    AND status = 'active'
  LIMIT 1;
$$;

-- Function to check if user is owner of the platform
CREATE OR REPLACE FUNCTION public.is_owner(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.tenant_users
    WHERE tenant_users.user_id = is_owner.user_id
      AND role = 'owner'
      AND status = 'active'
  );
$$;

-- Function to check if user is admin of a specific tenant
CREATE OR REPLACE FUNCTION public.is_tenant_admin(user_id UUID, tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.tenant_users
    WHERE tenant_users.user_id = is_tenant_admin.user_id
      AND tenant_users.tenant_id = is_tenant_admin.tenant_id
      AND role IN ('admin', 'owner')
      AND status = 'active'
  );
$$;

-- Function to create tenant with admin user
CREATE OR REPLACE FUNCTION public.create_tenant_with_admin(
  tenant_name TEXT,
  tenant_subdomain TEXT,
  admin_email TEXT,
  admin_password TEXT,
  admin_name TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_tenant_id UUID;
  new_user_id UUID;
  result JSONB;
BEGIN
  -- Only owners can create tenants
  IF NOT public.is_owner(auth.uid()) THEN
    RAISE EXCEPTION 'Only owners can create tenants';
  END IF;

  -- Check if subdomain is already taken
  IF EXISTS (SELECT 1 FROM public.tenants WHERE subdomain = tenant_subdomain) THEN
    RAISE EXCEPTION 'Subdomain already exists';
  END IF;

  -- Create tenant
  INSERT INTO public.tenants (name, subdomain)
  VALUES (tenant_name, tenant_subdomain)
  RETURNING id INTO new_tenant_id;

  -- Create user in auth.users (this would need to be done via Supabase API in practice)
  -- For now, we'll return the tenant_id and handle user creation separately
  
  result := jsonb_build_object(
    'tenant_id', new_tenant_id,
    'tenant_name', tenant_name,
    'subdomain', tenant_subdomain,
    'message', 'Tenant created successfully. Create admin user via Supabase Auth API and link with tenant_users table.'
  );

  RETURN result;
END;
$$;

-- =====================================================
-- STEP 4: Create default tenant and migrate existing data
-- =====================================================

-- Create default tenant for existing data
INSERT INTO public.tenants (id, name, subdomain, status, plan_type)
VALUES (
  '00000000-0000-0000-0000-000000000001'::UUID,
  'Default Tenant',
  'default',
  'active',
  'enterprise'
);

-- Update existing data with default tenant_id
UPDATE public.profiles SET tenant_id = '00000000-0000-0000-0000-000000000001'::UUID WHERE tenant_id IS NULL;
UPDATE public.books SET tenant_id = '00000000-0000-0000-0000-000000000001'::UUID WHERE tenant_id IS NULL;
UPDATE public.courses SET tenant_id = '00000000-0000-0000-0000-000000000001'::UUID WHERE tenant_id IS NULL;
UPDATE public.events SET tenant_id = '00000000-0000-0000-0000-000000000001'::UUID WHERE tenant_id IS NULL;
UPDATE public.loans SET tenant_id = '00000000-0000-0000-0000-000000000001'::UUID WHERE tenant_id IS NULL;
UPDATE public.members SET tenant_id = '00000000-0000-0000-0000-000000000001'::UUID WHERE tenant_id IS NULL;
UPDATE public.pastoral_appointments SET tenant_id = '00000000-0000-0000-0000-000000000001'::UUID WHERE tenant_id IS NULL;
UPDATE public.pastoral_schedules SET tenant_id = '00000000-0000-0000-0000-000000000001'::UUID WHERE tenant_id IS NULL;
UPDATE public.reservations SET tenant_id = '00000000-0000-0000-0000-000000000001'::UUID WHERE tenant_id IS NULL;
UPDATE public.security_logs SET tenant_id = '00000000-0000-0000-0000-000000000001'::UUID WHERE tenant_id IS NULL;
UPDATE public.sunday_school_attendance SET tenant_id = '00000000-0000-0000-0000-000000000001'::UUID WHERE tenant_id IS NULL;
UPDATE public.sunday_school_classes SET tenant_id = '00000000-0000-0000-0000-000000000001'::UUID WHERE tenant_id IS NULL;
UPDATE public.sunday_school_class_teachers SET tenant_id = '00000000-0000-0000-0000-000000000001'::UUID WHERE tenant_id IS NULL;
UPDATE public.sunday_school_enrollments SET tenant_id = '00000000-0000-0000-0000-000000000001'::UUID WHERE tenant_id IS NULL;
UPDATE public.sunday_school_lessons SET tenant_id = '00000000-0000-0000-0000-000000000001'::UUID WHERE tenant_id IS NULL;
UPDATE public.sunday_school_teachers SET tenant_id = '00000000-0000-0000-0000-000000000001'::UUID WHERE tenant_id IS NULL;

-- Make tenant_id NOT NULL after migration (for data integrity)
ALTER TABLE public.profiles ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.books ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.courses ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.events ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.loans ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.members ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.pastoral_appointments ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.pastoral_schedules ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.reservations ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.security_logs ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.sunday_school_attendance ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.sunday_school_classes ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.sunday_school_class_teachers ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.sunday_school_enrollments ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.sunday_school_lessons ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.sunday_school_teachers ALTER COLUMN tenant_id SET NOT NULL;

-- =====================================================
-- STEP 5: RLS Policies for tenants table
-- =====================================================

-- Owners can view all tenants
CREATE POLICY "Owners can view all tenants"
ON public.tenants
FOR SELECT
USING (public.is_owner(auth.uid()));

-- Owners can create tenants
CREATE POLICY "Owners can create tenants"
ON public.tenants
FOR INSERT
WITH CHECK (public.is_owner(auth.uid()));

-- Owners can update tenants
CREATE POLICY "Owners can update tenants"
ON public.tenants
FOR UPDATE
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

-- Tenant admins can view their own tenant
CREATE POLICY "Tenant admins can view own tenant"
ON public.tenants
FOR SELECT
USING (
  id IN (
    SELECT tenant_id 
    FROM public.tenant_users 
    WHERE user_id = auth.uid() 
      AND status = 'active'
  )
);

-- =====================================================
-- STEP 6: RLS Policies for tenant_users table
-- =====================================================

-- Owners can view all tenant_users
CREATE POLICY "Owners can view all tenant users"
ON public.tenant_users
FOR SELECT
USING (public.is_owner(auth.uid()));

-- Owners can create tenant_users
CREATE POLICY "Owners can create tenant users"
ON public.tenant_users
FOR INSERT
WITH CHECK (public.is_owner(auth.uid()));

-- Owners can update tenant_users
CREATE POLICY "Owners can update tenant users"
ON public.tenant_users
FOR UPDATE
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

-- Tenant admins can view users in their tenant
CREATE POLICY "Tenant admins can view own tenant users"
ON public.tenant_users
FOR SELECT
USING (
  tenant_id = public.get_current_tenant_id()
);

-- =====================================================
-- STEP 7: Update trigger for updated_at
-- =====================================================

CREATE TRIGGER update_tenants_updated_at
BEFORE UPDATE ON public.tenants
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_tenant_users_updated_at
BEFORE UPDATE ON public.tenant_users
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();