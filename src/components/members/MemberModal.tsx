
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Member, MemberFormValues } from '@/types/appTypes';
import MemberForm from './MemberForm';

interface MemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (member: MemberFormValues) => void;
  member?: Member;
  mode: 'create' | 'edit';
}

const MemberModal: React.FC<MemberModalProps> = ({
  open,
  onOpenChange,
  onSave,
  member,
  mode
}) => {
  const handleSave = (formData: MemberFormValues) => {
    onSave(formData);
    onOpenChange(false);
  };

  const defaultValues: Partial<MemberFormValues> = member ? {
    name: member.name,
    email: member.email,
    phone: member.phone,
    address: member.address,
    birthdate: member.birthdate,
    joinDate: member.joinDate,
    // Garantir que o status seja do tipo correto
    status: member.status as 'active' | 'inactive',
    role: member.role,
    imageUrl: member.imageUrl
  } : {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Adicionar Novo Membro' : 'Editar Membro'}
          </DialogTitle>
        </DialogHeader>
        <MemberForm onSubmit={handleSave} defaultValues={defaultValues} mode={mode} />
      </DialogContent>
    </Dialog>
  );
};

export default MemberModal;
