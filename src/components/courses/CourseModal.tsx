
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CourseForm from './CourseForm';
import { Course } from '@/types/libraryTypes';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => void;
  course?: Course;
  title: string;
}

const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  course,
  title
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[700px] max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <CourseForm 
            defaultValues={course}
            onSubmit={onSave}
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseModal;
