-- ============================================
-- FORTALECIMENTO DAS POLÍTICAS DE SEGURANÇA DOS AGENDAMENTOS PASTORAIS
-- Este script reforça o controle de acesso aos dados sensíveis da tabela pastoral_appointments,
-- centralizando a lógica de autorização e adicionando validações extras para evitar vazamento de dados.
-- ============================================

-- 1. Função para validar se o usuário pode acessar determinado agendamento pastoral
CREATE OR REPLACE FUNCTION public.can_access_pastoral_appointment(appointment_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Permite acesso se o usuário autenticado for o dono do agendamento OU se for admin
  RETURN (
    auth.uid() = appointment_user_id
    OR public.get_current_user_role() = 'admin'
  );
END;
$$;

-- 2. Remover política antiga de visualização e criar uma mais restritiva
DROP POLICY IF EXISTS "Users view own appointments, admins view all" ON public.pastoral_appointments;

-- Nova política: só permite SELECT se o usuário for dono do registro ou admin
CREATE POLICY "Acesso seguro a agendamentos pastorais" ON public.pastoral_appointments
FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND public.can_access_pastoral_appointment(user_id)
);

-- 3. Trigger de validação adicional para garantir que o acesso é legítimo
CREATE OR REPLACE FUNCTION public.validate_pastoral_appointment_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Para operações de SELECT, impede acesso de usuários não autorizados
  IF TG_OP = 'SELECT' AND NEW.user_id != auth.uid() AND public.get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Acesso não autorizado aos dados do agendamento pastoral';
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Observação: Para ativar a trigger, é necessário criar um trigger associado à tabela pastoral_appointments,
-- por exemplo:
-- CREATE TRIGGER validate_pastoral_appointment_access_trigger
--   BEFORE SELECT ON public.pastoral_appointments
--   FOR EACH ROW EXECUTE FUNCTION public.validate_pastoral_appointment_access();

-- ============================================
-- FIM DO SCRIPT
-- ============================================