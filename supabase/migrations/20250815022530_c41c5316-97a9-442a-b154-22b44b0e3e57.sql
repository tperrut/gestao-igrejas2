-- Fix security issues with pastoral_appointments table

-- 1. Add user_id column for direct user association (more secure than email matching)
ALTER TABLE public.pastoral_appointments 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- 2. Drop existing RLS policies
DROP POLICY IF EXISTS "Admins can update pastoral appointments" ON public.pastoral_appointments;
DROP POLICY IF EXISTS "Authenticated users can create pastoral appointments" ON public.pastoral_appointments;  
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.pastoral_appointments;

-- 3. Create more secure RLS policies

-- Only allow users to create appointments for themselves
CREATE POLICY "Users can create own pastoral appointments" ON public.pastoral_appointments
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND member_email = LOWER(TRIM(auth.jwt() ->> 'email'))
);

-- Users can only view their own appointments, admins can view all
CREATE POLICY "Users view own appointments, admins view all" ON public.pastoral_appointments  
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR get_current_user_role() = 'admin'
);

-- Only admins can update appointments
CREATE POLICY "Only admins can update appointments" ON public.pastoral_appointments
FOR UPDATE  
TO authenticated
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- 4. Create validation trigger for appointment data
CREATE OR REPLACE FUNCTION public.validate_pastoral_appointment_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure user_id matches authenticated user for new appointments
  IF TG_OP = 'INSERT' AND NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot create appointment for another user';
  END IF;
  
  -- Validate email format and ensure it matches authenticated user's email
  IF TG_OP = 'INSERT' AND NOT public.is_valid_email(NEW.member_email) THEN
    RAISE EXCEPTION 'Invalid email format: %', NEW.member_email;
  END IF;
  
  -- Ensure email matches authenticated user (case insensitive)
  IF TG_OP = 'INSERT' AND LOWER(TRIM(NEW.member_email)) != LOWER(TRIM(auth.jwt() ->> 'email')) THEN
    RAISE EXCEPTION 'Email must match authenticated user email';
  END IF;
  
  -- Validate phone if provided
  IF NEW.member_phone IS NOT NULL AND NOT public.is_valid_phone(NEW.member_phone) THEN
    RAISE EXCEPTION 'Invalid phone format: %', NEW.member_phone;
  END IF;
  
  -- Sanitize sensitive fields
  NEW.member_name = TRIM(NEW.member_name);
  NEW.member_email = LOWER(TRIM(NEW.member_email));
  NEW.reason = TRIM(NEW.reason);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Apply validation trigger
DROP TRIGGER IF EXISTS validate_pastoral_appointment_data_trigger ON public.pastoral_appointments;
CREATE TRIGGER validate_pastoral_appointment_data_trigger
  BEFORE INSERT OR UPDATE ON public.pastoral_appointments
  FOR EACH ROW EXECUTE FUNCTION public.validate_pastoral_appointment_data();

-- 6. Update existing appointments to set user_id based on profile email matching
UPDATE public.pastoral_appointments 
SET user_id = p.id
FROM public.profiles p
WHERE LOWER(TRIM(pastoral_appointments.member_email)) = LOWER(TRIM(p.email))
AND pastoral_appointments.user_id IS NULL;