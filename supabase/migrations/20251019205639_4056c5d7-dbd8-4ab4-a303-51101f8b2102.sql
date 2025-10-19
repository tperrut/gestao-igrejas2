-- Drop existing policies on pastoral_appointments
DROP POLICY IF EXISTS "Users can view own tenant appointments" ON public.pastoral_appointments;
DROP POLICY IF EXISTS "Users can create own tenant appointments" ON public.pastoral_appointments;
DROP POLICY IF EXISTS "Tenant admins can manage tenant appointments" ON public.pastoral_appointments;
DROP POLICY IF EXISTS "Owners can manage all pastoral appointments" ON public.pastoral_appointments;

-- Create secure RLS policies for pastoral_appointments
-- Users can only view their own appointments (matching user_id AND email AND tenant)
CREATE POLICY "Users can view own appointments"
ON public.pastoral_appointments
FOR SELECT
USING (
  auth.uid() = user_id 
  AND member_email = LOWER(TRIM(auth.jwt() ->> 'email'))
  AND belongs_to_tenant(tenant_id)
);

-- Users can only create appointments for themselves
CREATE POLICY "Users can create own appointments"
ON public.pastoral_appointments
FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND member_email = LOWER(TRIM(auth.jwt() ->> 'email'))
  AND belongs_to_tenant(tenant_id)
);

-- Tenant admins can view and manage all appointments in their tenant
CREATE POLICY "Tenant admins can manage tenant appointments"
ON public.pastoral_appointments
FOR ALL
USING (
  is_tenant_admin(auth.uid(), tenant_id) 
  AND belongs_to_tenant(tenant_id)
)
WITH CHECK (
  is_tenant_admin(auth.uid(), tenant_id) 
  AND belongs_to_tenant(tenant_id)
);

-- Platform owners can manage all appointments
CREATE POLICY "Owners can manage all pastoral appointments"
ON public.pastoral_appointments
FOR ALL
USING (is_owner(auth.uid()))
WITH CHECK (is_owner(auth.uid()));