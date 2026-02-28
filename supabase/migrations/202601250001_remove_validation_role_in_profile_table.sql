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
  -- Remover/Comentar a validação de role, pois não existe mais em profiles
  -- IF NEW.role NOT IN ('admin', 'member') THEN
  --   RAISE EXCEPTION 'Role inválido: %', NEW.role;
  -- END IF;
  RETURN NEW;
END;
$function$;