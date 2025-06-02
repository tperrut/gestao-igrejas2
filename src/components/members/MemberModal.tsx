
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Member } from '@/types/libraryTypes';
import MemberForm, { MemberFormValues } from './MemberForm';

interface MemberModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onSave: (member: MemberFormValues) => void;
  member?: Member;
  title: string;
}

const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  member,
  title
}) => {
  const handleSave = (formData: MemberFormValues) => {
    onSave(formData);
    onClose(false);
  };

  const defaultValues: Partial<MemberFormValues> = member ? {
    name: member.name,
    email: member.email,
    phone: member.phone || "",
    birth_date: member.birth_date || "",
    join_date: member.join_date,
    status: member.status as 'active' | 'inactive',
    role: member.role || "",
    avatar_url: ""
  } : {
    name: "",
    email: "",
    phone: "",
    birth_date: "",
    join_date: "",
    status: "active",
    role: "",
    avatar_url: ""
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <MemberForm 
          onSubmit={handleSave} 
          defaultValues={defaultValues}
          onCancel={() => onClose(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MemberModal;
