
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoanForm, { LoanFormValues } from './LoanForm';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (loan: LoanFormValues) => void;
  loan?: Partial<LoanFormValues>;
  title: string;
}

const LoanModal: React.FC<LoanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  loan,
  title
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] px-4 sm:px-6">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <LoanForm 
          defaultValues={loan}
          onSubmit={onSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default LoanModal;
