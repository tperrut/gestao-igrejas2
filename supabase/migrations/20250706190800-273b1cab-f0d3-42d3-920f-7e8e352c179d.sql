
-- Remover políticas públicas muito permissivas e substituir por políticas baseadas em roles

-- 1. BOOKS TABLE - Remover acesso público e implementar controle baseado em roles
DROP POLICY IF EXISTS "Allow public delete access to books" ON public.books;
DROP POLICY IF EXISTS "Allow public insert access to books" ON public.books;
DROP POLICY IF EXISTS "Allow public update access to books" ON public.books;

-- Manter apenas visualização pública para livros (necessário para a funcionalidade)
-- Política "Everyone can view books" já existe e está correta

-- Criar política mais restritiva para operações de escrita em livros
CREATE POLICY "Only authenticated admins can manage books" ON public.books
FOR ALL USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 2. MEMBERS TABLE - Substituir acesso público por controle baseado em roles
DROP POLICY IF EXISTS "Allow public delete access to members" ON public.members;
DROP POLICY IF EXISTS "Allow public insert access to members" ON public.members;
DROP POLICY IF EXISTS "Allow public read access to members" ON public.members;
DROP POLICY IF EXISTS "Allow public update access to members" ON public.members;

-- Criar políticas mais seguras para members
CREATE POLICY "Admins can manage all members" ON public.members
FOR ALL USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Users can view their own member profile" ON public.members
FOR SELECT USING (
  auth.uid() IS NOT NULL AND 
  email = (auth.jwt() ->> 'email'::text)
);

-- 3. LOANS TABLE - Remover acesso público e implementar controle baseado em roles
DROP POLICY IF EXISTS "Allow public delete access to loans" ON public.loans;
DROP POLICY IF EXISTS "Allow public insert access to loans" ON public.loans;
DROP POLICY IF EXISTS "Allow public read access to loans" ON public.loans;
DROP POLICY IF EXISTS "Allow public update access to loans" ON public.loans;

-- Manter políticas existentes que são mais seguras
-- "Only admins can manage loans" já existe e está correta
-- "Members can view their own loans" já existe e está correta

-- 4. RESERVATIONS TABLE - Melhorar políticas existentes
-- Substituir política muito permissiva de insert
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.reservations;

CREATE POLICY "Authenticated users can create reservations" ON public.reservations
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.members 
    WHERE id = member_id AND email = (auth.jwt() ->> 'email'::text)
  )
);

-- Adicionar política para permitir que usuários vejam suas próprias reservas
CREATE POLICY "Users can view their own reservations" ON public.reservations
FOR SELECT USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.members 
    WHERE id = member_id AND email = (auth.jwt() ->> 'email'::text)
  )
);

-- 5. PASTORAL APPOINTMENTS - Melhorar controle de acesso
DROP POLICY IF EXISTS "Anyone can create pastoral appointments" ON public.pastoral_appointments;
DROP POLICY IF EXISTS "Anyone can update pastoral appointments" ON public.pastoral_appointments;
DROP POLICY IF EXISTS "Anyone can view pastoral appointments" ON public.pastoral_appointments;

-- Criar políticas mais seguras para pastoral appointments
CREATE POLICY "Authenticated users can create pastoral appointments" ON public.pastoral_appointments
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own appointments" ON public.pastoral_appointments
FOR SELECT USING (
  auth.uid() IS NOT NULL AND 
  (member_email = (auth.jwt() ->> 'email'::text) OR
   EXISTS (
     SELECT 1 FROM public.profiles 
     WHERE id = auth.uid() AND role = 'admin'
   ))
);

CREATE POLICY "Admins can update pastoral appointments" ON public.pastoral_appointments
FOR UPDATE USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 6. PROFILES TABLE - Permitir que admins vejam todos os perfis para gerenciamento
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Substituir política existente mais restritiva
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- 7. Adicionar função de validação de email
CREATE OR REPLACE FUNCTION public.is_valid_email(email text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

-- 8. Adicionar função de validação de telefone
CREATE OR REPLACE FUNCTION public.is_valid_phone(phone text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- Aceita formatos brasileiros comuns
  RETURN phone IS NULL OR phone ~* '^\+?[0-9\s\-\(\)]{10,15}$';
END;
$$;

-- 9. Adicionar triggers de validação para members
CREATE OR REPLACE FUNCTION public.validate_member_data()
RETURNS trigger
LANGUAGE plpgsql
AS $$
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
$$;

CREATE TRIGGER validate_member_data_trigger
  BEFORE INSERT OR UPDATE ON public.members
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_member_data();

-- 10. Adicionar trigger de validação para profiles
CREATE OR REPLACE FUNCTION public.validate_profile_data()
RETURNS trigger
LANGUAGE plpgsql
AS $$
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
$$;

CREATE TRIGGER validate_profile_data_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_data();
