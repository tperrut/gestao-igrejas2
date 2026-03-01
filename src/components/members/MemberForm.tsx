
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Member } from '@/types/libraryTypes';
import { validateEmail, validatePhone, sanitizeText } from '@/utils/validation';
import SecurityAlert from '@/components/security/SecurityAlert';
import { Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  avatar_url: z.string().optional(),
});

export type MemberFormValues = z.infer<typeof memberSchema>;

interface MemberFormProps {
  defaultValues?: Partial<MemberFormValues>;
  onSubmit: (data: MemberFormValues) => void;
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
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
      phone: defaultValues?.phone || '',
      birth_date: defaultValues?.birth_date || '',
      join_date: defaultValues?.join_date || new Date().toISOString().split('T')[0],
      role: defaultValues?.role || '',
      status: defaultValues?.status || 'active',
      avatar_url: defaultValues?.avatar_url || '',
    }
  });

  const [avatarUrl, setAvatarUrl] = useState(defaultValues?.avatar_url || '');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Tipo inválido", description: "Use JPEG, PNG ou WebP.", variant: "destructive" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Arquivo muito grande", description: "Máximo 2MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `members/${fileName}`;

      const { data, error } = await supabase.storage
        .from('member-avatars')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('member-avatars')
        .getPublicUrl(data.path);

      setAvatarUrl(publicUrl);
      setValue('avatar_url', publicUrl);
      toast({ title: "Imagem enviada com sucesso!" });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: "Erro no upload", description: "Não foi possível enviar a imagem.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setAvatarUrl('');
    setValue('avatar_url', '');
  };

  const onFormSubmit = (data: MemberFormValues) => {
    // Sanitize text inputs before submission
    const sanitizedData: MemberFormValues = {
      name: sanitizeText(data.name),
      email: data.email.toLowerCase().trim(),
      phone: data.phone?.trim() || '',
      role: data.role ? sanitizeText(data.role) : '',
      avatar_url: data.avatar_url || '',
      status: data.status,
      birth_date: data.birth_date || '',
      join_date: data.join_date,
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

      <div className="space-y-4">
        <Label>Foto do Membro</Label>
        {avatarUrl ? (
          <div className="relative inline-block">
            <img src={avatarUrl} alt="Avatar" className="w-32 h-32 object-cover rounded-lg border" />
            <Button type="button" variant="destructive" size="sm" className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0" onClick={handleRemoveImage}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">JPEG, PNG ou WebP. Máximo 2MB.</p>
            <Input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} disabled={uploading} className="hidden" id="member-avatar-upload" />
            <Label htmlFor="member-avatar-upload" className="inline-block mt-2 cursor-pointer">
              <Button type="button" variant="outline" size="sm" asChild><span>{uploading ? 'Enviando...' : 'Selecionar Arquivo'}</span></Button>
            </Label>
          </div>
        )}
      </div>

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
