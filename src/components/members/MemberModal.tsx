
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MemberForm, { MemberFormValues } from './MemberForm';
import { Member } from '@/types/libraryTypes';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <MemberForm 
          defaultValues={member}
          onSubmit={onSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MemberModal;
