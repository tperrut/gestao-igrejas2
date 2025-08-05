
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Check, ArrowLeft } from 'lucide-react';

const PricingPlan: React.FC<{
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant?: "default" | "outline";
}> = ({ name, price, period, description, features, popular = false, buttonText, buttonVariant = "default" }) => (
  <Card className={`relative ${popular ? 'border-church-blue shadow-lg scale-105' : ''}`}>
    {popular && (
      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-church-blue text-white">
        Mais Popular
      </Badge>
    )}
    <CardHeader className="text-center">
      <CardTitle className="text-2xl">{name}</CardTitle>
      <div className="mt-4">
        <span className="text-4xl font-bold text-church-blue">{price}</span>
        <span className="text-muted-foreground">/{period}</span>
      </div>
      <CardDescription className="text-center mt-2">
        {description}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Link to="/commercial-contact" className="w-full">
        <Button 
          className="w-full" 
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                <span className="bg-gradient-to-r from-church-red to-amber-400 text-transparent bg-clip-text font-bold">
                  AltarHub - Preços
                </span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/commercial-contact">
                <Button variant="outline" aria-label="Entrar em contato comercial para dúvidas">
                  Fale Conosco
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Escolha o Plano Ideal para sua Igreja
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Oferecemos soluções flexíveis que crescem junto com sua comunidade. 
            Todos os planos incluem 30 dias de teste gratuito, sem compromisso.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
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
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Por que escolher a AltarHub?
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="text-left">
                <h3 className="text-xl font-semibold text-church-blue mb-3">
                  Flexibilidade Total
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Altere seu plano a qualquer momento conforme sua igreja cresce. 
                  Sem taxas de cancelamento ou multas por alteração de plano.
                </p>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-church-blue mb-3">
                  Suporte Especializado
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Nossa equipe entende as necessidades únicas das igrejas e oferece 
                  suporte técnico e pastoral personalizado.
                </p>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-church-blue mb-3">
                  Segurança e Privacidade
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Dados criptografados, backups automáticos e conformidade com a LGPD. 
                  Seus dados estão seguros conosco.
                </p>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-church-blue mb-3">
                  Atualizações Contínuas
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Novos recursos são adicionados regularmente sem custo adicional. 
                  Sua igreja sempre terá acesso às últimas funcionalidades.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Perguntas Frequentes
            </h2>
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  O teste gratuito é realmente grátis?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Sim, oferecemos 30 dias completamente gratuitos. Não pedimos cartão de crédito 
                  e você pode cancelar a qualquer momento durante o período de teste.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Posso mudar de plano depois?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Absolutamente! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                  As alterações são aplicadas imediatamente e o valor é ajustado proporcionalmente.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Os dados da minha igreja ficam seguros?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Sim, utilizamos criptografia de ponta e fazemos backups regulares. Nossos servidores 
                  estão em conformidade com as melhores práticas de segurança e LGPD.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-church-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pronto para transformar a gestão da sua igreja?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Junte-se a centenas de igrejas que estão usando a AltarHub para simplificar sua administração.
          </p>
          <Link to="/commercial-contact">
            <Button 
              size="lg" 
              className="bg-white text-church-blue hover:bg-gray-100"
              aria-label="Iniciar teste gratuito da plataforma AltarHub"
            >
              Começar Teste Gratuito
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
