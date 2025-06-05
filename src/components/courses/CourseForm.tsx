
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUpload from './ImageUpload';

const courseFormSchema = z.object({
  title: z.string().min(3, { message: "Título deve ter pelo menos 3 caracteres" }),
  description: z.string().optional(),
  instructor: z.string().min(1, { message: "Instrutor é obrigatório" }),
  start_date: z.string().min(1, { message: "Data de início é obrigatória" }),
  end_date: z.string().min(1, { message: "Data de término é obrigatória" }),
  location: z.string().optional(),
  max_students: z.coerce.number().min(1, { message: "Número máximo de alunos deve ser maior que zero" }),
  students: z.coerce.number().min(0, { message: "Número de alunos deve ser maior ou igual a zero" }),
  status: z.string().min(1, { message: "Status é obrigatório" }),
  category: z.string().min(1, { message: "Categoria é obrigatória" }),
  prerequisites: z.string().optional(),
  image_url: z.string().optional(),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

interface CourseFormProps {
  defaultValues?: Partial<CourseFormValues>;
  onSubmit: (data: CourseFormValues) => void;
  onCancel: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({
  defaultValues = {
    title: "",
    description: "",
    instructor: "",
    start_date: "",
    end_date: "",
    location: "",
    max_students: 0,
    students: 0,
    status: "inactive",
    category: "biblia",
    prerequisites: "",
    image_url: "",
  },
  onSubmit,
  onCancel
}) => {
  const [imageUrl, setImageUrl] = useState(defaultValues.image_url || "");

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      ...defaultValues,
      image_url: imageUrl,
    },
  });

  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
    form.setValue('image_url', url);
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    form.setValue('image_url', "");
  };

  const handleFormSubmit = (data: CourseFormValues) => {
    onSubmit({
      ...data,
      image_url: imageUrl,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Estudo Bíblico Básico" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ImageUpload
          onImageUploaded={handleImageUploaded}
          currentImage={imageUrl}
          onRemoveImage={handleRemoveImage}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição do curso..." rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="instructor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instrutor</FormLabel>
                <FormControl>
                  <Input placeholder="Pastor João" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Local</FormLabel>
                <FormControl>
                  <Input placeholder="Sala 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Início</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Término</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="coming_soon">Em Breve</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="biblia">Bíblia</SelectItem>
                    <SelectItem value="lideranca">Liderança</SelectItem>
                    <SelectItem value="discipulado">Discipulado</SelectItem>
                    <SelectItem value="evangelismo">Evangelismo</SelectItem>
                    <SelectItem value="familia">Família</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="max_students"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Máximo de Alunos</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="students"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alunos Inscritos</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="prerequisites"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pré-requisitos</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva os pré-requisitos do curso..." rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CourseForm;
