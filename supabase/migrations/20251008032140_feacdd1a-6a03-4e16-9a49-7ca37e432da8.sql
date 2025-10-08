-- ================================================
-- MIGRAÇÃO PARA SISTEMA MULTI-TENANT
-- ================================================

-- PASSO 1: Criar tenant default para dados existentes
-- ================================================
INSERT INTO public.tenants (id, name, subdomain, status, plan_type)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Default Tenant',
  'default',
  'active',
  'enterprise'
)
ON CONFLICT (id) DO NOTHING;

-- PASSO 2: Popular tenant_id em todas as tabelas com dados existentes
-- ================================================

-- Atualizar books
UPDATE public.books 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

-- Atualizar members
UPDATE public.members 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

-- Atualizar loans
UPDATE public.loans 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

-- Atualizar reservations
UPDATE public.reservations 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

-- Atualizar events
UPDATE public.events 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

-- Atualizar courses
UPDATE public.courses 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

-- Atualizar pastoral_appointments
UPDATE public.pastoral_appointments 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

-- Atualizar pastoral_schedules
UPDATE public.pastoral_schedules 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

-- Atualizar sunday_school_teachers
UPDATE public.sunday_school_teachers 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

-- Atualizar sunday_school_classes
UPDATE public.sunday_school_classes 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

-- Atualizar sunday_school_enrollments
UPDATE public.sunday_school_enrollments 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

-- Atualizar sunday_school_lessons
UPDATE public.sunday_school_lessons 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

-- Atualizar sunday_school_attendance
UPDATE public.sunday_school_attendance 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

-- Atualizar sunday_school_class_teachers
UPDATE public.sunday_school_class_teachers 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

-- Atualizar security_logs
UPDATE public.security_logs 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

-- Atualizar profiles
UPDATE public.profiles 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

-- PASSO 3: Adicionar constraints NOT NULL após popular os dados
-- ================================================

-- Já estão definidos como NOT NULL no schema atual, apenas garantindo
ALTER TABLE public.books ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.members ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.loans ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.reservations ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.events ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.courses ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.pastoral_appointments ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.pastoral_schedules ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.sunday_school_teachers ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.sunday_school_classes ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.sunday_school_enrollments ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.sunday_school_lessons ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.sunday_school_attendance ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.sunday_school_class_teachers ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.security_logs ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN tenant_id SET NOT NULL;

-- PASSO 4: Criar índices para melhor performance
-- ================================================

CREATE INDEX IF NOT EXISTS idx_books_tenant_id ON public.books(tenant_id);
CREATE INDEX IF NOT EXISTS idx_members_tenant_id ON public.members(tenant_id);
CREATE INDEX IF NOT EXISTS idx_loans_tenant_id ON public.loans(tenant_id);
CREATE INDEX IF NOT EXISTS idx_reservations_tenant_id ON public.reservations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_events_tenant_id ON public.events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_courses_tenant_id ON public.courses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pastoral_appointments_tenant_id ON public.pastoral_appointments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pastoral_schedules_tenant_id ON public.pastoral_schedules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sunday_school_teachers_tenant_id ON public.sunday_school_teachers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sunday_school_classes_tenant_id ON public.sunday_school_classes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sunday_school_enrollments_tenant_id ON public.sunday_school_enrollments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sunday_school_lessons_tenant_id ON public.sunday_school_lessons(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sunday_school_attendance_tenant_id ON public.sunday_school_attendance(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sunday_school_class_teachers_tenant_id ON public.sunday_school_class_teachers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_tenant_id ON public.security_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON public.profiles(tenant_id);

-- Índices compostos para queries comuns
CREATE INDEX IF NOT EXISTS idx_members_tenant_email ON public.members(tenant_id, email);
CREATE INDEX IF NOT EXISTS idx_loans_tenant_status ON public.loans(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_events_tenant_date ON public.events(tenant_id, date);
CREATE INDEX IF NOT EXISTS idx_courses_tenant_status ON public.courses(tenant_id, status);

-- PASSO 5: Criar função helper para verificar pertencimento ao tenant
-- ================================================

CREATE OR REPLACE FUNCTION public.belongs_to_tenant(check_tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.tenant_users
    WHERE user_id = auth.uid()
      AND tenant_id = check_tenant_id
      AND status = 'active'
  );
$$;

-- PASSO 6: Atualizar RLS policies para isolamento multi-tenant
-- ================================================

-- BOOKS: Drop e recriar policies
DROP POLICY IF EXISTS "Admins delete books" ON public.books;
DROP POLICY IF EXISTS "Admins insert books" ON public.books;
DROP POLICY IF EXISTS "Admins manage books" ON public.books;
DROP POLICY IF EXISTS "Admins update books" ON public.books;
DROP POLICY IF EXISTS "Books public read" ON public.books;
DROP POLICY IF EXISTS "Public read books" ON public.books;

CREATE POLICY "Owners can manage all books"
ON public.books FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

CREATE POLICY "Tenant admins can manage tenant books"
ON public.books FOR ALL
USING (
  public.is_tenant_admin(auth.uid(), tenant_id) 
  AND public.belongs_to_tenant(tenant_id)
)
WITH CHECK (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
);

CREATE POLICY "Tenant members can view tenant books"
ON public.books FOR SELECT
USING (public.belongs_to_tenant(tenant_id));

-- MEMBERS: Drop e recriar policies
DROP POLICY IF EXISTS "Admins can view all member records" ON public.members;
DROP POLICY IF EXISTS "Only admins can create members" ON public.members;
DROP POLICY IF EXISTS "Only admins can delete members" ON public.members;
DROP POLICY IF EXISTS "Only admins can update members" ON public.members;
DROP POLICY IF EXISTS "Users can view their own member record" ON public.members;

CREATE POLICY "Owners can manage all members"
ON public.members FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

CREATE POLICY "Tenant admins can manage tenant members"
ON public.members FOR ALL
USING (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
)
WITH CHECK (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
);

CREATE POLICY "Tenant members can view tenant members"
ON public.members FOR SELECT
USING (public.belongs_to_tenant(tenant_id));

-- LOANS: Drop e recriar policies
DROP POLICY IF EXISTS "Admins manage loans" ON public.loans;
DROP POLICY IF EXISTS "Members view own loans" ON public.loans;

CREATE POLICY "Owners can manage all loans"
ON public.loans FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

CREATE POLICY "Tenant admins can manage tenant loans"
ON public.loans FOR ALL
USING (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
)
WITH CHECK (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
);

CREATE POLICY "Tenant members can view tenant loans"
ON public.loans FOR SELECT
USING (public.belongs_to_tenant(tenant_id));

-- RESERVATIONS: Drop e recriar policies
DROP POLICY IF EXISTS "Admins manage reservations" ON public.reservations;
DROP POLICY IF EXISTS "Members can create own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Members can view their own reservations" ON public.reservations;

CREATE POLICY "Owners can manage all reservations"
ON public.reservations FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

CREATE POLICY "Tenant admins can manage tenant reservations"
ON public.reservations FOR ALL
USING (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
)
WITH CHECK (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
);

CREATE POLICY "Tenant members can manage own reservations"
ON public.reservations FOR ALL
USING (
  public.belongs_to_tenant(tenant_id)
  AND EXISTS (
    SELECT 1 FROM members m
    WHERE m.id = reservations.member_id
    AND m.email = (auth.jwt() ->> 'email')
  )
)
WITH CHECK (
  public.belongs_to_tenant(tenant_id)
  AND EXISTS (
    SELECT 1 FROM members m
    WHERE m.id = reservations.member_id
    AND m.email = (auth.jwt() ->> 'email')
  )
);

-- EVENTS: Drop e recriar policies
DROP POLICY IF EXISTS "Admins can create events" ON public.events;
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Users can view events" ON public.events;

CREATE POLICY "Owners can manage all events"
ON public.events FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

CREATE POLICY "Tenant admins can manage tenant events"
ON public.events FOR ALL
USING (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
)
WITH CHECK (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
);

CREATE POLICY "Tenant members can view tenant events"
ON public.events FOR SELECT
USING (public.belongs_to_tenant(tenant_id));

-- COURSES: Drop e recriar policies
DROP POLICY IF EXISTS "Admins can create courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can delete courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can update courses" ON public.courses;
DROP POLICY IF EXISTS "Users can view courses" ON public.courses;

CREATE POLICY "Owners can manage all courses"
ON public.courses FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

CREATE POLICY "Tenant admins can manage tenant courses"
ON public.courses FOR ALL
USING (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
)
WITH CHECK (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
);

CREATE POLICY "Tenant members can view tenant courses"
ON public.courses FOR SELECT
USING (public.belongs_to_tenant(tenant_id));

-- PASTORAL APPOINTMENTS: Drop e recriar policies
DROP POLICY IF EXISTS "Acesso seguro a agendamentos pastorais" ON public.pastoral_appointments;
DROP POLICY IF EXISTS "Only admins can update appointments" ON public.pastoral_appointments;
DROP POLICY IF EXISTS "Users can create own pastoral appointments" ON public.pastoral_appointments;

CREATE POLICY "Owners can manage all pastoral appointments"
ON public.pastoral_appointments FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

CREATE POLICY "Tenant admins can manage tenant appointments"
ON public.pastoral_appointments FOR ALL
USING (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
)
WITH CHECK (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
);

CREATE POLICY "Users can create own tenant appointments"
ON public.pastoral_appointments FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND member_email = LOWER(TRIM(auth.jwt() ->> 'email'))
  AND public.belongs_to_tenant(tenant_id)
);

CREATE POLICY "Users can view own tenant appointments"
ON public.pastoral_appointments FOR SELECT
USING (
  auth.uid() = user_id
  AND public.belongs_to_tenant(tenant_id)
);

-- PASTORAL SCHEDULES: Drop e recriar policies
DROP POLICY IF EXISTS "Permite gerenciar somente para Admin" ON public.pastoral_schedules;

CREATE POLICY "Owners can manage all schedules"
ON public.pastoral_schedules FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

CREATE POLICY "Tenant admins can manage tenant schedules"
ON public.pastoral_schedules FOR ALL
USING (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
)
WITH CHECK (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
);

CREATE POLICY "Tenant members can view tenant schedules"
ON public.pastoral_schedules FOR SELECT
USING (public.belongs_to_tenant(tenant_id));

-- SUNDAY SCHOOL TABLES: Drop e recriar policies
DROP POLICY IF EXISTS "Only admins can manage teachers" ON public.sunday_school_teachers;
DROP POLICY IF EXISTS "Only admins can manage classes" ON public.sunday_school_classes;
DROP POLICY IF EXISTS "Only admins can manage enrollments" ON public.sunday_school_enrollments;
DROP POLICY IF EXISTS "Only admins can manage lessons" ON public.sunday_school_lessons;
DROP POLICY IF EXISTS "Only admins can manage attendance" ON public.sunday_school_attendance;
DROP POLICY IF EXISTS "Only admins can manage class teachers" ON public.sunday_school_class_teachers;

-- Sunday School Teachers
CREATE POLICY "Owners can manage all teachers"
ON public.sunday_school_teachers FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

CREATE POLICY "Tenant admins can manage tenant teachers"
ON public.sunday_school_teachers FOR ALL
USING (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
)
WITH CHECK (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
);

-- Sunday School Classes
CREATE POLICY "Owners can manage all classes"
ON public.sunday_school_classes FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

CREATE POLICY "Tenant admins can manage tenant classes"
ON public.sunday_school_classes FOR ALL
USING (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
)
WITH CHECK (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
);

-- Sunday School Enrollments
CREATE POLICY "Owners can manage all enrollments"
ON public.sunday_school_enrollments FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

CREATE POLICY "Tenant admins can manage tenant enrollments"
ON public.sunday_school_enrollments FOR ALL
USING (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
)
WITH CHECK (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
);

-- Sunday School Lessons
CREATE POLICY "Owners can manage all lessons"
ON public.sunday_school_lessons FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

CREATE POLICY "Tenant admins can manage tenant lessons"
ON public.sunday_school_lessons FOR ALL
USING (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
)
WITH CHECK (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
);

-- Sunday School Attendance
CREATE POLICY "Owners can manage all attendance"
ON public.sunday_school_attendance FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

CREATE POLICY "Tenant admins can manage tenant attendance"
ON public.sunday_school_attendance FOR ALL
USING (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
)
WITH CHECK (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
);

-- Sunday School Class Teachers
CREATE POLICY "Owners can manage all class teachers"
ON public.sunday_school_class_teachers FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

CREATE POLICY "Tenant admins can manage tenant class teachers"
ON public.sunday_school_class_teachers FOR ALL
USING (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
)
WITH CHECK (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
);

-- SECURITY LOGS: Drop e recriar policies
DROP POLICY IF EXISTS "Admins can view security logs" ON public.security_logs;

CREATE POLICY "Owners can view all security logs"
ON public.security_logs FOR SELECT
USING (public.is_owner(auth.uid()));

CREATE POLICY "Tenant admins can view tenant security logs"
ON public.security_logs FOR SELECT
USING (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
);

-- PROFILES: Drop e recriar policies
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Only admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile or admins can view all" ON public.profiles;

CREATE POLICY "Owners can manage all profiles"
ON public.profiles FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

CREATE POLICY "Tenant admins can manage tenant profiles"
ON public.profiles FOR ALL
USING (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
)
WITH CHECK (
  public.is_tenant_admin(auth.uid(), tenant_id)
  AND public.belongs_to_tenant(tenant_id)
);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.belongs_to_tenant(tenant_id));