
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CommercialContact: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    church: '',
    phone: '',
    members: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Mensagem enviada!",
      description: "Nossa equipe comercial entrará em contato em até 24 horas.",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      church: '',
      phone: '',
      members: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" aria-label="Voltar para página inicial">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                <span className="bg-gradient-to-r from-church-red to-amber-400 text-transparent bg-clip-text font-bold">
                  Contato Comercial
                </span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/pricing">
                <Button variant="outline" aria-label="Ver preços e planos disponíveis">
                  Ver Preços
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Fale com Nossa Equipe Comercial
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Estamos prontos para ajudar sua igreja a encontrar a melhor solução de gestão. 
              Entre em contato conosco e descubra como podemos transformar a administração da sua comunidade.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Contact Form */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="text-2xl text-church-blue">Solicite uma Demonstração</CardTitle>
                <CardDescription>
                  Preencha o formulário e nossa equipe entrará em contato para agendar uma demonstração personalizada.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Seu nome"
                        aria-label="Digite seu nome completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="seu@email.com"
                        aria-label="Digite seu endereço de email"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="church">Nome da Igreja *</Label>
                      <Input
                        id="church"
                        name="church"
                        type="text"
                        required
                        value={formData.church}
                        onChange={handleInputChange}
                        placeholder="Nome da sua igreja"
                        aria-label="Digite o nome da sua igreja"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(11) 99999-9999"
                        aria-label="Digite seu número de telefone"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="members">Número de Membros (aproximadamente)</Label>
                    <Input
                      id="members"
                      name="members"
                      type="number"
                      value={formData.members}
                      onChange={handleInputChange}
                      placeholder="Ex: 150"
                      aria-label="Digite o número aproximado de membros da igreja"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Conte-nos mais sobre suas necessidades específicas..."
                      className="min-h-[120px]"
                      aria-label="Digite sua mensagem com detalhes sobre suas necessidades"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    aria-label="Enviar formulário de contato comercial"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Contact Details */}
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="text-church-blue">Entre em Contato Direto</CardTitle>
                  <CardDescription>
                    Nossa equipe está disponível para esclarecer suas dúvidas e ajudar na escolha do melhor plano.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-church-blue flex-shrink-0" />
                    <div>
                      <p className="font-medium">Email Comercial</p>
                      <a 
                        href="mailto:vendas@betelhub.com" 
                        className="text-church-blue hover:underline"
                        aria-label="Enviar email para equipe comercial"
                      >
                        vendas@betelhub.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-church-blue flex-shrink-0" />
                    <div>
                      <p className="font-medium">Telefone Comercial</p>
                      <a 
                        href="tel:+5511999999999" 
                        className="text-church-blue hover:underline"
                        aria-label="Ligar para equipe comercial"
                      >
                        (11) 9999-9999
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-church-blue flex-shrink-0" />
                    <div>
                      <p className="font-medium">Endereço</p>
                      <p className="text-gray-600 dark:text-gray-300">
                        São Paulo, SP - Brasil
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-church-blue flex-shrink-0" />
                    <div>
                      <p className="font-medium">Horário de Atendimento</p>
                      <p className="text-gray-600 dark:text-gray-300">
                        Segunda a Sexta: 9h às 18h
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card className="card-hover bg-church-blue text-white">
                <CardHeader>
                  <CardTitle>Por que escolher a BetelHub?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-white mt-2 flex-shrink-0"></div>
                    <p className="text-sm">30 dias de teste gratuito, sem compromisso</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-white mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Suporte especializado em gestão eclesiástica</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-white mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Dados seguros e em conformidade com a LGPD</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-white mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Atualizações constantes sem custo adicional</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialContact;
