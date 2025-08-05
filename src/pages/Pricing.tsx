
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import Logo from '@/components/ui/logo';
import { Check, ArrowLeft, Star, Users, BookOpen, Calendar } from 'lucide-react';

const PricingPlan: React.FC<{
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant?: "default" | "outline";
  icon: React.ReactNode;
}> = ({ name, price, period, description, features, popular = false, buttonText, buttonVariant = "default", icon }) => (
  <Card className={`relative h-full ${popular ? 'border-church-blue shadow-2xl scale-105 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800' : 'shadow-lg hover:shadow-xl transition-all duration-300'}`}>
    {popular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <Badge className="bg-gradient-to-r from-church-blue to-blue-600 text-white px-4 py-2 text-sm font-semibold shadow-lg">
          <Star className="w-4 h-4 mr-1" />
          Mais Popular
        </Badge>
      </div>
    )}
    <CardHeader className="text-center pb-8 pt-8">
      <div className="flex justify-center mb-4">
        <div className={`p-3 rounded-full ${popular ? 'bg-church-blue text-white' : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300'}`}>
          {icon}
        </div>
      </div>
      <CardTitle className="text-2xl font-montserrat mb-4">{name}</CardTitle>
      <div className="mb-4">
        <span className="text-5xl font-bold bg-gradient-to-r from-church-blue to-church-red text-transparent bg-clip-text">{price}</span>
        <span className="text-muted-foreground text-lg">/{period}</span>
      </div>
      <CardDescription className="text-center text-base text-gray-600 dark:text-gray-300">
        {description}
      </CardDescription>
    </CardHeader>
    <CardContent className="px-6">
      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter className="pt-8">
      <Link to="/commercial-contact" className="w-full">
        <Button 
          className={`w-full h-12 text-base font-semibold transition-all duration-300 ${
            popular 
              ? 'bg-gradient-to-r from-church-blue to-blue-600 hover:from-church-blue-dark hover:to-blue-700 text-white shadow-lg hover:shadow-xl' 
              : ''
          }`}
          variant={buttonVariant}
          aria-label={`Contratar plano ${name} - ${buttonText}`}
        >
          {buttonText}
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Essencial",
      price: "R$ 99",
      period: "mês",
      description: "Ideal para igrejas pequenas com até 100 membros",
      icon: <Users className="w-6 h-6" />,
      features: [
        "Gestão de até 100 membros",
        "Biblioteca básica (até 200 livros)",
        "Calendário de eventos",
        "Relatórios básicos",
        "1 usuário administrador",
        "Suporte por email",
        "Backup semanal dos dados"
      ],
      buttonText: "Começar Teste Gratuito",
      buttonVariant: "outline" as const
    },
    {
      name: "Profissional",
      price: "R$ 199",
      period: "mês",
      description: "Perfeito para igrejas em crescimento com até 500 membros",
      icon: <BookOpen className="w-6 h-6" />,
      features: [
        "Gestão de até 500 membros",
        "Biblioteca completa (até 1000 livros)",
        "Sistema de empréstimos avançado",
        "Gestão financeira completa",
        "Até 5 usuários administradores",
        "Consultas pastorais online",
        "Relatórios avançados e dashboards",
        "Suporte prioritário",
        "Backup diário dos dados",
        "Integração com sistemas de pagamento"
      ],
      popular: true,
      buttonText: "Experimentar Grátis",
      buttonVariant: "default" as const
    },
    {
      name: "Enterprise",
      price: "R$ 399",
      period: "mês",
      description: "Solução completa para grandes igrejas e denominações",
      icon: <Calendar className="w-6 h-6" />,
      features: [
        "Membros ilimitados",
        "Biblioteca ilimitada",
        "Múltiplas filiais/congregações",
        "Sistema de cursos e EAD",
        "Usuários administrativos ilimitados",
        "API para integrações personalizadas",
        "Relatórios personalizados",
        "Suporte 24/7 com telefone",
        "Backup em tempo real",
        "Gerente de conta dedicado",
        "Treinamento personalizado da equipe",
        "Customizações exclusivas"
      ],
      buttonText: "Falar com Especialista",
      buttonVariant: "default" as const
    }
  ];

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
              <div className="flex items-center space-x-3">
                <Logo size="sm" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white font-montserrat">
                  <span className="bg-gradient-to-r from-church-red to-amber-400 text-transparent bg-clip-text">
                    AltarHub
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 ml-2">Preços</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/commercial-contact">
                <Button variant="outline" aria-label="Entrar em contato comercial para dúvidas sobre planos">
                  Fale Conosco
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-church-blue to-blue-600 opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-montserrat mb-6">
            <span className="bg-gradient-to-r from-church-blue to-church-red text-transparent bg-clip-text">
              Escolha o Plano Ideal
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">para sua Igreja</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Oferecemos soluções flexíveis que crescem junto com sua comunidade. 
            <span className="font-semibold text-church-blue"> Todos os planos incluem 30 dias de teste gratuito</span>, sem compromisso.
          </p>
          <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Mais de 500+ igrejas confiam na AltarHub
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <PricingPlan
                key={index}
                name={plan.name}
                price={plan.price}
                period={plan.period}
                description={plan.description}
                features={plan.features}
                popular={plan.popular}
                buttonText={plan.buttonText}
                buttonVariant={plan.buttonVariant}
                icon={plan.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
              <span className="bg-gradient-to-r from-church-blue to-church-red text-transparent bg-clip-text">
                Por que escolher
              </span>
              <span className="text-gray-900 dark:text-white"> a AltarHub?</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
              Uma plataforma completa, segura e pensada especificamente para igrejas
            </p>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-6 h-6 text-church-blue" />
                </div>
                <h3 className="text-lg font-semibold text-church-blue mb-3 font-montserrat">
                  Flexibilidade Total
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Altere seu plano a qualquer momento conforme sua igreja cresce. 
                  Sem taxas de cancelamento ou multas por alteração de plano.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-church-blue mb-3 font-montserrat">
                  Suporte Especializado
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Nossa equipe entende as necessidades únicas das igrejas e oferece 
                  suporte técnico e pastoral personalizado.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Calendar className="w-6 h-6 text-church-red" />
                </div>
                <h3 className="text-lg font-semibold text-church-blue mb-3 font-montserrat">
                  Segurança e Privacidade
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Dados criptografados, backups automáticos e conformidade com a LGPD. 
                  Seus dados estão seguros conosco.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-church-blue mb-3 font-montserrat">
                  Atualizações Contínuas
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Novos recursos são adicionados regularmente sem custo adicional. 
                  Sua igreja sempre terá acesso às últimas funcionalidades.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center font-montserrat mb-12">
              <span className="bg-gradient-to-r from-church-blue to-church-red text-transparent bg-clip-text">
                Perguntas Frequentes
              </span>
            </h2>
            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg font-montserrat">
                  O teste gratuito é realmente grátis?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Sim, oferecemos 30 dias completamente gratuitos. Não pedimos cartão de crédito 
                  e você pode cancelar a qualquer momento durante o período de teste.
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg font-montserrat">
                  Posso mudar de plano depois?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Absolutamente! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                  As alterações são aplicadas imediatamente e o valor é ajustado proporcionalmente.
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg font-montserrat">
                  Os dados da minha igreja ficam seguros?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Sim, utilizamos criptografia de ponta e fazemos backups regulares. Nossos servidores 
                  estão em conformidade com as melhores práticas de segurança e LGPD.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-church-blue to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-church-blue-dark to-church-blue opacity-90"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center mb-8">
            <Logo size="md" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">
            Pronto para transformar a gestão da sua igreja?
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Junte-se a centenas de igrejas que estão usando a 
            <span className="font-bold text-yellow-200"> AltarHub</span> para simplificar sua administração.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/commercial-contact">
              <Button 
                size="lg" 
                className="bg-white text-church-blue hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                aria-label="Iniciar teste gratuito da plataforma AltarHub"
              >
                Começar Teste Gratuito
              </Button>
            </Link>
            <Link to="/commercial-contact">
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-church-blue px-8 py-4 text-lg font-semibold transition-all duration-300"
                aria-label="Falar com especialista em gestão de igrejas"
              >
                Falar com Especialista
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
