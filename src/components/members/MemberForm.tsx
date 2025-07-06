
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Member } from '@/types/libraryTypes';
import { validateEmail, validatePhone, sanitizeText } from '@/utils/validation';
import SecurityAlert from '@/components/security/SecurityAlert';
import SecureImageUpload from '@/components/security/SecureImageUpload';

const memberSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .refine((val) => val.trim().length > 0, 'Nome não pode estar vazio'),
  email: z.string()
    .email('Email inválido')
    .refine(validateEmail, 'Formato de email inválido'),
  phone: z.string()
    .optional()
    .refine((val) => !val || validatePhone(val), 'Formato de telefone inválido'),
  birth_date: z.string().optional(),
  join_date: z.string().min(1, 'Data de entrada é obrigatória'),
  role: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface MemberFormProps {
  defaultValues?: Partial<Member>;
  onSubmit: (data: Omit<Member, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
      phone: defaultValues?.phone || '',
      birth_date: defaultValues?.birth_date || '',
      join_date: defaultValues?.join_date || new Date().toISOString().split('T')[0],
      role: defaultValues?.role || '',
      status: defaultValues?.status || 'active',
    }
  });

  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);

  const onFormSubmit = (data: MemberFormData) => {
    // Sanitize text inputs before submission
    const sanitizedData = {
      ...data,
      name: sanitizeText(data.name),
      email: data.email.toLowerCase().trim(),
      phone: data.phone?.trim() || null,
      role: data.role ? sanitizeText(data.role) : null,
      avatar_url: defaultValues?.avatar_url || null, // Will be updated separately if avatar is uploaded
    };

    onSubmit(sanitizedData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <SecurityAlert
        type="info"
        title="Informações de Segurança"
        description="Todos os dados serão validados e sanitizados antes do armazenamento. Mantenha as informações atualizadas e precisas."
        className="mb-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Digite o nome completo"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="exemplo@email.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="(11) 99999-9999"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birth_date">Data de Nascimento</Label>
          <Input
            id="birth_date"
            type="date"
            {...register('birth_date')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="join_date">Data de Entrada *</Label>
          <Input
            id="join_date"
            type="date"
            {...register('join_date')}
            className={errors.join_date ? 'border-red-500' : ''}
          />
          {errors.join_date && (
            <p className="text-sm text-red-500">{errors.join_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Função</Label>
          <Input
            id="role"
            {...register('role')}
            placeholder="Ex: Diácono, Presbítero, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select 
            value={watch('status')} 
            onValueChange={(value) => setValue('status', value as 'active' | 'inactive')}
          >
            <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>
      </div>

      <SecureImageUpload
        onImageSelect={setAvatarFile}
        currentImageUrl={defaultValues?.avatar_url}
        maxSizeMB={2}
        className="md:col-span-2"
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Salvando...' : 'Salvar Membro'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default MemberForm;
