
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CourseForm from './CourseForm';
import { CourseCategory, CourseStatus } from './CoursesList';

interface Course {
  id?: number;
  title: string;
  instructor: string;
  startDate: string;
  endDate: string;
  status: CourseStatus;
  category: CourseCategory;
  maxStudents: number;
  students?: number;
  description?: string;
  location?: string;
  prerequisites?: string;
}

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Omit<Course, 'id' | 'students'>) => void;
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
      <DialogContent className="w-full max-w-[95%] sm:max-w-[600px] h-[90vh] sm:h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <CourseForm 
          defaultValues={course}
          onSubmit={onSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CourseModal;
