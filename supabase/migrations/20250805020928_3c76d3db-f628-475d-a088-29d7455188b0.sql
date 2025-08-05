
-- Fix database function security by adding proper search path settings
-- This prevents SQL injection attacks through search_path manipulation

CREATE OR REPLACE FUNCTION public.validate_profile_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Validar email
  IF NOT public.is_valid_email(NEW.email) THEN
    RAISE EXCEPTION 'Email inválido: %', NEW.email;
  END IF;
  
  -- Validar nome não vazio
  IF trim(NEW.name) = '' THEN
    RAISE EXCEPTION 'Nome não pode estar vazio';
  END IF;
  
  -- Validar role
  IF NEW.role NOT IN ('admin', 'member') THEN
    RAISE EXCEPTION 'Role inválido: %', NEW.role;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.expire_reservations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.reservations 
  SET status = 'expired'
  WHERE status = 'active' 
  AND expires_at < now();
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, required_role text)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id
      AND role = required_role
  )
$function$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'Usuário'),
    'member'
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT public.has_role(user_id, 'admin')
$function$;

CREATE OR REPLACE FUNCTION public.update_book_availability()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- When a new loan is created (book borrowed)
  IF TG_OP = 'INSERT' THEN
    UPDATE public.books SET available_copies = available_copies - 1 WHERE id = NEW.book_id;
  -- When a loan status changes to 'returned'
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'returned' AND OLD.status != 'returned' THEN
    UPDATE public.books SET available_copies = available_copies + 1 WHERE id = NEW.book_id;
  -- When a loan status changes from 'returned' to something else
  ELSIF TG_OP = 'UPDATE' AND NEW.status != 'returned' AND OLD.status = 'returned' THEN
    UPDATE public.books SET available_copies = available_copies - 1 WHERE id = NEW.book_id;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_valid_email(email text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_valid_phone(phone text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Aceita formatos brasileiros comuns
  RETURN phone IS NULL OR phone ~* '^\+?[0-9\s\-\(\)]{10,15}$';
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_member_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Validar email
  IF NOT public.is_valid_email(NEW.email) THEN
    RAISE EXCEPTION 'Email inválido: %', NEW.email;
  END IF;
  
  -- Validar telefone se fornecido
  IF NOT public.is_valid_phone(NEW.phone) THEN
    RAISE EXCEPTION 'Telefone inválido: %', NEW.phone;
  END IF;
  
  -- Validar nome não vazio
  IF trim(NEW.name) = '' THEN
    RAISE EXCEPTION 'Nome não pode estar vazio';
  END IF;
  
  RETURN NEW;
END;
$function$;
