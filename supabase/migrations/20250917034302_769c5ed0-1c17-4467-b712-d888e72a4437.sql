-- ============================================
-- SISTEMA DE ESCOLA DOMINICAL - VERSÃO REVISADA
-- Inclui: cadastro de professores, múltiplos professores por turma,
-- professor específico por aula e valor da oferta na aula
-- ============================================

-- 1. Tabela de Professores da Escola Dominical
CREATE TABLE public.sunday_school_teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  specialization text, -- Ex: "Crianças", "Jovens", "Adultos"
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 2. Tabela de Turmas da Escola Dominical
CREATE TABLE public.sunday_school_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age_group text NOT NULL, -- Ex: "3-5 anos", "6-10 anos", "Jovens", "Adultos"
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 3. Tabela de Relacionamento: Professores por Turma (many-to-many)
CREATE TABLE public.sunday_school_class_teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.sunday_school_classes(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES public.sunday_school_teachers(id) ON DELETE CASCADE,
  is_primary boolean NOT NULL DEFAULT false, -- Professor principal da turma
  assigned_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  
  UNIQUE(class_id, teacher_id)
);

-- 4. Tabela de Matrículas (Membros nas Turmas)
CREATE TABLE public.sunday_school_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES public.sunday_school_classes(id) ON DELETE CASCADE,
  enrollment_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'transferred')),
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  UNIQUE(member_id, class_id, status) -- Um membro só pode estar ativo em uma turma por vez
);

-- 5. Tabela de Aulas (com professor específico e valor da oferta)
CREATE TABLE public.sunday_school_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.sunday_school_classes(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES public.sunday_school_teachers(id),
  lesson_date date NOT NULL,
  topic text,
  offering_amount decimal(10,2) DEFAULT 0.00, -- Valor da oferta da aula
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  UNIQUE(class_id, lesson_date) -- Uma aula por turma por data
);

-- 6. Tabela de Presença
CREATE TABLE public.sunday_school_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES public.sunday_school_lessons(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  present boolean NOT NULL DEFAULT true,
  arrival_time time,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  
  UNIQUE(lesson_id, member_id) -- Um registro de presença por aluno por aula
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.sunday_school_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sunday_school_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sunday_school_class_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sunday_school_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sunday_school_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sunday_school_attendance ENABLE ROW LEVEL SECURITY;

-- Políticas para Professores (apenas admins)
CREATE POLICY "Only admins can manage teachers"
  ON public.sunday_school_teachers
  FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Políticas para Turmas (apenas admins)
CREATE POLICY "Only admins can manage classes"
  ON public.sunday_school_classes
  FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Políticas para Relacionamento Turma-Professor (apenas admins)
CREATE POLICY "Only admins can manage class teachers"
  ON public.sunday_school_class_teachers
  FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Políticas para Matrículas (apenas admins)
CREATE POLICY "Only admins can manage enrollments"
  ON public.sunday_school_enrollments
  FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Políticas para Aulas (apenas admins)
CREATE POLICY "Only admins can manage lessons"
  ON public.sunday_school_lessons
  FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Políticas para Presença (apenas admins)
CREATE POLICY "Only admins can manage attendance"
  ON public.sunday_school_attendance
  FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ============================================
-- TRIGGERS PARA UPDATED_AT
-- ============================================

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_sunday_school_teachers_updated_at
  BEFORE UPDATE ON public.sunday_school_teachers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_sunday_school_classes_updated_at
  BEFORE UPDATE ON public.sunday_school_classes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_sunday_school_enrollments_updated_at
  BEFORE UPDATE ON public.sunday_school_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_sunday_school_lessons_updated_at
  BEFORE UPDATE ON public.sunday_school_lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

-- Índices para melhorar performance das consultas
CREATE INDEX idx_sunday_school_enrollments_member_status ON public.sunday_school_enrollments(member_id, status);
CREATE INDEX idx_sunday_school_enrollments_class_status ON public.sunday_school_enrollments(class_id, status);
CREATE INDEX idx_sunday_school_lessons_date ON public.sunday_school_lessons(lesson_date);
CREATE INDEX idx_sunday_school_lessons_class_date ON public.sunday_school_lessons(class_id, lesson_date);
CREATE INDEX idx_sunday_school_attendance_lesson ON public.sunday_school_attendance(lesson_id);
CREATE INDEX idx_sunday_school_class_teachers_class ON public.sunday_school_class_teachers(class_id);

-- ============================================
-- COMENTÁRIOS DAS TABELAS
-- ============================================

COMMENT ON TABLE public.sunday_school_teachers IS 'Cadastro de professores da Escola Dominical';
COMMENT ON TABLE public.sunday_school_classes IS 'Turmas da Escola Dominical organizadas por faixa etária';
COMMENT ON TABLE public.sunday_school_class_teachers IS 'Relacionamento many-to-many entre turmas e professores';
COMMENT ON TABLE public.sunday_school_enrollments IS 'Matrículas dos membros nas turmas da Escola Dominical';
COMMENT ON TABLE public.sunday_school_lessons IS 'Registro das aulas com professor específico e valor da oferta';
COMMENT ON TABLE public.sunday_school_attendance IS 'Controle de presença dos alunos por aula';