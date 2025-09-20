-- Add visitor support to attendance table
ALTER TABLE public.sunday_school_attendance 
ADD COLUMN visitor_name text;

-- Allow null member_id for visitors
ALTER TABLE public.sunday_school_attendance 
ALTER COLUMN member_id DROP NOT NULL;