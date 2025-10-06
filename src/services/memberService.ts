
import { supabase } from '@/integrations/supabase/client';
import { Member } from '@/types/libraryTypes';
import { useToast } from "@/components/ui/use-toast";
import { logger } from '@/utils/logger';
import { getDefaultTenantId } from '@/utils/tenant';

export const useMemberService = () => {
  const { toast } = useToast();

  const logMemberAction = (action: string, details: any) => {
    const timestamp = new Date().toLocaleString('pt-BR');
    const logMessage = `[${timestamp}] ${action}`;
    
    console.log(logMessage, details);
    logger.businessLog(action, details);
  };

  const fetchMembers = async (): Promise<Member[]> => {
    try {
      logger.dbLog('Fetching members from database');
      
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      const members = data || [];

      // Log detailed member query results
      logMemberAction('CONSULTA_MEMBROS', {
        totalMembros: members.length,
        membrosAtivos: members.filter(member => member.status === 'active').length,
        membrosInativos: members.filter(member => member.status === 'inactive').length,
        funcoes: [...new Set(members.map(member => member.role).filter(Boolean))]
      });

      logger.dbLog('Members fetched successfully', { count: members.length });
      return members;
    } catch (error) {
      logger.dbError('Failed to fetch members', error instanceof Error ? error : new Error(String(error)));
      
      toast({
        title: "Erro ao carregar membros",
        description: "Ocorreu um erro ao buscar os membros.",
        variant: "destructive"
      });
      console.error("Erro ao buscar membros:", error);
      return [];
    }
  };

  const saveMember = async (memberData: Omit<Member, 'id' | 'created_at' | 'updated_at' | 'tenant_id'>): Promise<boolean> => {
    try {
      logger.businessLog('Creating new member', { name: memberData.name, email: memberData.email });
      
      const { error} = await supabase
        .from('members')
        .insert([{ ...memberData, tenant_id: getDefaultTenantId() }]);

      if (error) throw error;

      // Log detailed member creation
      logMemberAction('MEMBRO_CRIADO', {
        nome: memberData.name,
        email: memberData.email,
        telefone: memberData.phone,
        funcao: memberData.role,
        dataEntrada: memberData.join_date,
        status: memberData.status
      });

      toast({
        title: "Membro adicionado",
        description: "O membro foi adicionado com sucesso."
      });
      return true;
    } catch (error) {
      logger.businessError('Failed to create member', error instanceof Error ? error : new Error(String(error)));
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o membro.",
        variant: "destructive"
      });
      console.error("Erro ao criar membro:", error);
      return false;
    }
  };

  const updateMember = async (id: string, memberData: Partial<Member>): Promise<boolean> => {
    try {
      logger.businessLog('Updating member', { id, updates: memberData });
      
      const { error } = await supabase
        .from('members')
        .update(memberData)
        .eq('id', id);

      if (error) throw error;

      // Log detailed member update
      logMemberAction('MEMBRO_ATUALIZADO', {
        id,
        nome: memberData.name,
        email: memberData.email,
        alteracoes: Object.keys(memberData)
      });

      toast({
        title: "Membro atualizado",
        description: "O membro foi atualizado com sucesso."
      });
      return true;
    } catch (error) {
      logger.businessError('Failed to update member', error instanceof Error ? error : new Error(String(error)));
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o membro.",
        variant: "destructive"
      });
      console.error("Erro ao atualizar membro:", error);
      return false;
    }
  };

  const inactivateMember = async (id: string): Promise<boolean> => {
    try {
      // Get member details for logging
      const { data: memberData } = await supabase
        .from('members')
        .select('name, email, status')
        .eq('id', id)
        .single();

      if (!memberData) {
        throw new Error('Membro não encontrado');
      }

      // Check if member has active loans
      const { data: activeLoans } = await supabase
        .from('loans')
        .select('id')
        .eq('member_id', id)
        .in('status', ['active', 'overdue']);

      if (activeLoans && activeLoans.length > 0) {
        toast({
          title: "Não é possível inativar",
          description: "O membro possui empréstimos ativos. Regularize a situação antes de inativar.",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('members')
        .update({ status: 'inactive' })
        .eq('id', id);

      if (error) throw error;

      // Log detailed member inactivation
      logMemberAction('MEMBRO_INATIVADO', {
        id,
        nome: memberData.name,
        email: memberData.email,
        statusAnterior: memberData.status,
        motivo: 'Inativação manual pelo administrador'
      });

      toast({
        title: "Membro inativado",
        description: "O membro foi inativado com sucesso."
      });
      return true;
    } catch (error) {
      logger.businessError('Failed to inactivate member', error instanceof Error ? error : new Error(String(error)));
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao inativar o membro.",
        variant: "destructive"
      });
      console.error("Erro ao inativar membro:", error);
      return false;
    }
  };

  const reactivateMember = async (id: string): Promise<boolean> => {
    try {
      // Get member details for logging
      const { data: memberData } = await supabase
        .from('members')
        .select('name, email, status')
        .eq('id', id)
        .single();

      if (!memberData) {
        throw new Error('Membro não encontrado');
      }

      const { error } = await supabase
        .from('members')
        .update({ status: 'active' })
        .eq('id', id);

      if (error) throw error;

      // Log detailed member reactivation
      logMemberAction('MEMBRO_REATIVADO', {
        id,
        nome: memberData.name,
        email: memberData.email,
        statusAnterior: memberData.status
      });

      toast({
        title: "Membro reativado",
        description: "O membro foi reativado com sucesso."
      });
      return true;
    } catch (error) {
      logger.businessError('Failed to reactivate member', error instanceof Error ? error : new Error(String(error)));
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao reativar o membro.",
        variant: "destructive"
      });
      console.error("Erro ao reativar membro:", error);
      return false;
    }
  };

  const deleteMember = async (id: string): Promise<boolean> => {
    try {
      // Get member details for logging
      const { data: memberData } = await supabase
        .from('members')
        .select('name, email')
        .eq('id', id)
        .single();

      // Check if member has any loans (active, returned, etc.)
      const { data: memberLoans } = await supabase
        .from('loans')
        .select('id')
        .eq('member_id', id);

      if (memberLoans && memberLoans.length > 0) {
        toast({
          title: "Não é possível excluir",
          description: "O membro possui histórico de empréstimos. Use a opção 'Inativar' ao invés de excluir.",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Log detailed member deletion
      logMemberAction('MEMBRO_EXCLUIDO', {
        id,
        nome: memberData?.name,
        email: memberData?.email,
        motivo: 'Exclusão permanente pelo administrador'
      });

      toast({
        title: "Membro excluído",
        description: "O membro foi excluído permanentemente."
      });
      return true;
    } catch (error) {
      logger.businessError('Failed to delete member', error instanceof Error ? error : new Error(String(error)));
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o membro.",
        variant: "destructive"
      });
      console.error("Erro ao deletar membro:", error);
      return false;
    }
  };

  return {
    fetchMembers,
    saveMember,
    updateMember,
    inactivateMember,
    reactivateMember,
    deleteMember
  };
};
