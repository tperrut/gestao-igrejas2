
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, UserRound } from 'lucide-react';

const memberFormSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos" }),
  status: z.enum(["active", "inactive"]),
  role: z.string().min(1, { message: "Função é obrigatória" }),
  join_date: z.string().min(1, { message: "Data de entrada é obrigatória" }),
  birth_date: z.string().optional(),
});

export type MemberFormValues = z.infer<typeof memberFormSchema> & {
  avatar_url?: string;
};

interface MemberFormProps {
  defaultValues?: Partial<MemberFormValues>;
  onSubmit: (data: MemberFormValues) => void;
  onCancel: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({
  defaultValues = {
    name: "",
    email: "",
    phone: "",
    status: "active",
    role: "",
    join_date: "",
    birth_date: "",
    avatar_url: "",
  },
  onSubmit,
  onCancel
}) => {
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues,
  });
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(defaultValues.avatar_url);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${Date.now()}.${fileExt}`;
      
      setUploading(true);
      
      // Upload da imagem para o bucket "members"
      const { error: uploadError, data } = await supabase.storage
        .from('members')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Obter a URL pública da imagem
      const { data: { publicUrl } } = supabase.storage
        .from('members')
        .getPublicUrl(filePath);
        
      setAvatarUrl(publicUrl);
      toast({
        title: "Imagem carregada com sucesso",
        description: "A imagem do membro foi carregada."
      });
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      toast({
        title: "Erro ao carregar imagem",
        description: "Ocorreu um erro ao fazer upload da imagem.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = (data: MemberFormValues) => {
    onSubmit({ ...data, avatar_url: avatarUrl });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="Foto do membro" />
            ) : (
              <AvatarFallback>
                <UserRound className="h-12 w-12 text-gray-400" />
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex items-center">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
              id="avatar-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('avatar-upload')?.click()}
              disabled={uploading}
              className="flex items-center"
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Carregando..." : "Upload de Foto"}
            </Button>
          </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="João Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="exemplo@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(11) 99999-9999" {...field} />
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
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Função</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pastor">Pastor</SelectItem>
                    <SelectItem value="Líder de Louvor">Líder de Louvor</SelectItem>
                    <SelectItem value="Diácono">Diácono</SelectItem>
                    <SelectItem value="Membro">Membro</SelectItem>
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
            name="join_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Entrada</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birth_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">Cancelar</Button>
          <Button type="submit" className="w-full sm:w-auto">Salvar</Button>
        </div>
      </form>
    </Form>
  );
};

export default MemberForm;
