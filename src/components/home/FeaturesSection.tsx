
import React from 'react';
import { Book, Calendar, CreditCard, Users, LayoutDashboard, GraduationCap } from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Book,
      title: "Gestão de Biblioteca",
      description: "Gerencie seu acervo, controle empréstimos e acompanhe reservas de livros.",
      link: "/library",
      colorClass: "bg-church-blue/10 text-church-blue"
    },
    {
      icon: Calendar,
      title: "Agenda Integrada",
      description: "Organize eventos, cultos, ensaios e aulas em um calendário unificado.",
      link: "/calendar",
      colorClass: "bg-church-red/10 text-church-red"
    },
    {
      icon: CreditCard,
      title: "Gestão Financeira",
      description: "Controle dízimos, ofertas e despesas com relatórios detalhados.",
      link: "/finance",
      colorClass: "bg-green-100 text-green-600"
    },
    {
      icon: Users,
      title: "Gestão de Membros",
      description: "Cadastre membros, acompanhe frequência e ministre cuidado pastoral.",
      link: "/members",
      colorClass: "bg-amber-100 text-amber-600"
    },
    {
      icon: LayoutDashboard,
      title: "Dashboard Personalizado",
      description: "Visualize dados importantes da sua igreja em um painel interativo.",
      link: "/dashboard",
      colorClass: "bg-purple-100 text-purple-600"
    },
    {
      icon: GraduationCap,
      title: "Cursos",
      description: "Gerencie cursos, matrículas e acompanhe o progresso dos alunos.",
      link: "/courses",
      colorClass: "bg-blue-100 text-blue-600"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-church-blue mb-4">Recursos Principais</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Uma solução completa para a gestão administrativa, financeira e pastoral da sua igreja.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              link={feature.link}
              colorClass={feature.colorClass}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
