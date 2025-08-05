
import React from 'react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/ui/logo';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  phone: z.string().min(10, { message: "O telefone deve ter pelo menos 10 dígitos" }),
  church: z.string().min(2, { message: "O nome da igreja deve ter pelo menos 2 caracteres" }),
  subject: z.string().min(5, { message: "O assunto deve ter pelo menos 5 caracteres" }),
  message: z.string().min(10, { message: "A mensagem deve ter pelo menos 10 caracteres" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const CommercialContact: React.FC = () => {
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      church: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(data: ContactFormValues) {
    toast({
      title: "Mensagem enviada com sucesso!",
      description: "Nossa equipe comercial entrará em contato em breve para apresentar a Plataforma AltarHub.",
    });
    form.reset();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3">
              <Logo size="sm" />
              <span className="text-xl font-bold bg-gradient-to-r from-church-red to-amber-400 text-transparent bg-clip-text">
                AltarHub
              </span>
            </Link>
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar à Home</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-church-blue mb-4">
              Fale Conosco
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Interessado na <span className="font-bold text-church-red">Plataforma AltarHub</span>? 
              Entre em contato conosco e descubra como podemos revolucionar a gestão da sua igreja.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informações de Contato */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-church-blue">Contato Comercial</CardTitle>
                  <CardDescription>
                    Nossa equipe está pronta para apresentar a solução ideal para sua igreja
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-church-blue/10 p-2 rounded-full">
                      <Phone className="h-5 w-5 text-church-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium">Vendas</h3>
                      <p className="text-sm text-muted-foreground">(21) 99999-0000</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-church-blue/10 p-2 rounded-full">
                      <Mail className="h-5 w-5 text-church-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium">E-mail Comercial</h3>
                      <p className="text-sm text-muted-foreground">vendas@altarhub.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-church-blue/10 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-church-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium">Escritório</h3>
                      <p className="text-sm text-muted-foreground">
                        Rio de Janeiro - RJ<br />
                        Atendimento em todo Brasil
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-church-blue">Horário de Atendimento</CardTitle>
                  <CardDescription>Quando nossa equipe está disponível</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 font-semibold">
                      <Clock className="h-4 w-4 text-church-blue" />
                      <span>Segunda a Sexta:</span>
                    </div>
                    <p className="ml-6">9h às 18h</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-semibold">
                      <Clock className="h-4 w-4 text-church-blue" />
                      <span>Sábado:</span>
                    </div>
                    <p className="ml-6">9h às 12h</p>
                  </div>
                  <div className="text-sm text-muted-foreground mt-3">
                    Respondemos em até 2 horas durante o horário comercial
                  </div>
                </CardContent>
              </Card>

              {/* Benefícios */}
              <Card className="bg-gradient-to-br from-church-blue to-church-blue-dark text-white shadow-lg">
                <CardHeader>
                  <CardTitle>Por que escolher a AltarHub?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-amber-400 rounded-full"></div>
                    <span className="text-sm">Gestão completa em uma plataforma</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-amber-400 rounded-full"></div>
                    <span className="text-sm">Suporte técnico especializado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-amber-400 rounded-full"></div>
                    <span className="text-sm">Treinamento completo da equipe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-amber-400 rounded-full"></div>
                    <span className="text-sm">Implementação personalizada</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulário */}
            <div className="lg:col-span-2">
              <Card className="h-full bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-church-blue">Solicite uma Demonstração</CardTitle>
                  <CardDescription>
                    Preencha o formulário e nossa equipe entrará em contato para agendar uma demonstração personalizada
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome Completo</FormLabel>
                              <FormControl>
                                <Input placeholder="Seu nome completo" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="seu.email@exemplo.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone/WhatsApp</FormLabel>
                              <FormControl>
                                <Input placeholder="(21) 98765-4321" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="church"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome da Igreja</FormLabel>
                              <FormControl>
                                <Input placeholder="Nome da sua igreja" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assunto</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Demonstração da plataforma, orçamento personalizado..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mensagem</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Conte-nos um pouco sobre sua igreja e suas necessidades de gestão..." 
                                className="min-h-[120px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end pt-4">
                        <Button 
                          type="submit" 
                          size="lg"
                          className="w-full sm:w-auto bg-church-red hover:bg-church-red/90"
                        >
                          Solicitar Demonstração
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-church-blue text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Logo size="sm" />
            <span className="text-2xl font-bold">AltarHub</span>
          </div>
          <p className="text-church-blue-light">
            A plataforma completa para gestão da sua igreja
          </p>
          <div className="mt-6 text-sm text-church-blue-light">
            &copy; 2025 AltarHub. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CommercialContact;
