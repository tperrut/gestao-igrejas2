
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EventForm from './EventForm';
import { Event } from '@/types/libraryTypes';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => void;
  event?: Event;
  title: string;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  event,
  title
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[600px] max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <EventForm 
            defaultValues={event}
            onSubmit={onSave}
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
