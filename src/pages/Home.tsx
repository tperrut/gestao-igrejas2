
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CreditCard, Book, Users, LayoutDashboard, GraduationCap } from 'lucide-react';
import Logo from '@/components/ui/logo';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-church-blue py-16 md:py-24">
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <Logo size="lg" withText />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text font-bold">Plataforma</span> <span className="bg-gradient-to-r from-church-red to-amber-400 text-transparent bg-clip-text font-bold">AltarHub</span>, a gestão da sua igreja 100% Online!
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-8">
              A plataforma completa para gestão da sua igreja. Integre membros, recursos e atividades em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-church-blue hover:bg-gray-100">
                  Acessar Sistema
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" className="bg-white text-church-blue hover:bg-orange-100">
                  Fale Conosco
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-church-blue-dark to-church-blue opacity-90"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-church-blue mb-4">Recursos Principais</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Uma solução completa para a gestão administrativa, financeira e pastoral da sua igreja.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
            <Card className="card-hover">
              <CardHeader className="pb-2 text-center">
                <div className="mx-auto p-3 rounded-full bg-church-blue/10 mb-4">
                  <Book className="h-8 w-8 text-church-blue" />
                </div>
                <CardTitle className="text-xl">Gestão de Biblioteca</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Gerencie seu acervo, controle empréstimos e acompanhe reservas de livros.
                </p>
              </CardContent>
              <CardFooter className="pt-0 justify-center">
                <Link to="/library">
                  <Button variant="outline" className="text-church-blue">Saiba Mais</Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="card-hover">
              <CardHeader className="pb-2 text-center">
                <div className="mx-auto p-3 rounded-full bg-church-red/10 mb-4">
                  <Calendar className="h-8 w-8 text-church-red" />
                </div>
                <CardTitle className="text-xl">Agenda Integrada</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Organize eventos, cultos, ensaios e aulas em um calendário unificado.
                </p>
              </CardContent>
              <CardFooter className="pt-0 justify-center">
                <Link to="/calendar">
                  <Button variant="outline" className="text-church-red">Saiba Mais</Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="card-hover">
              <CardHeader className="pb-2 text-center">
                <div className="mx-auto p-3 rounded-full bg-green-100 mb-4">
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Gestão Financeira</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Controle dízimos, ofertas e despesas com relatórios detalhados.
                </p>
              </CardContent>
              <CardFooter className="pt-0 justify-center">
                <Link to="/finance">
                  <Button variant="outline" className="text-green-600">Saiba Mais</Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="card-hover">
              <CardHeader className="pb-2 text-center">
                <div className="mx-auto p-3 rounded-full bg-amber-100 mb-4">
                  <Users className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-xl">Gestão de Membros</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Cadastre membros, acompanhe frequência e ministre cuidado pastoral.
                </p>
              </CardContent>
              <CardFooter className="pt-0 justify-center">
                <Link to="/members">
                  <Button variant="outline" className="text-amber-600">Saiba Mais</Button>
                </Link>
              </CardFooter>
            </Card>
            
            {/* Novo card - Dashboard Personalizado */}
            <Card className="card-hover">
              <CardHeader className="pb-2 text-center">
                <div className="mx-auto p-3 rounded-full bg-purple-100 mb-4">
                  <LayoutDashboard className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Dashboard Personalizado</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Visualize dados importantes da sua igreja em um painel interativo.
                </p>
              </CardContent>
              <CardFooter className="pt-0 justify-center">
                <Link to="/dashboard">
                  <Button variant="outline" className="text-purple-600">Saiba Mais</Button>
                </Link>
              </CardFooter>
            </Card>
            
            {/* Novo card - Cursos */}
            <Card className="card-hover">
              <CardHeader className="pb-2 text-center">
                <div className="mx-auto p-3 rounded-full bg-blue-100 mb-4">
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Cursos</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Gerencie cursos, matrículas e acompanhe o progresso dos alunos.
                </p>
              </CardContent>
              <CardFooter className="pt-0 justify-center">
                <Link to="/courses">
                  <Button variant="outline" className="text-blue-600">Saiba Mais</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-church-blue mb-4">Depoimentos</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Veja o que nossos usuários dizem sobre o ChurchConnect Nexus.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex text-church-blue">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  "O módulo de biblioteca revolucionou nossa gestão de livros. Conseguimos reduzir as perdas e aumentar o engajamento da comunidade com a leitura."
                </p>
                <div className="flex items-center">
                  <div className="ml-4">
                    <p className="font-semibold">Pastor Eduardo</p>
                    <p className="text-sm text-gray-500">Igreja Batista Central</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex text-church-blue">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  "A gestão financeira ficou muito mais transparente e organizada. Os relatórios são claros e nos ajudam a tomar decisões estratégicas."
                </p>
                <div className="flex items-center">
                  <div className="ml-4">
                    <p className="font-semibold">Marcos Silva</p>
                    <p className="text-sm text-gray-500">Igreja Presbiteriana Renovada</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex text-church-blue">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  "O calendário integrado acabou com os conflitos de agenda e melhorou muito nossa comunicação interna. Recomendo a todas as igrejas!"
                </p>
                <div className="flex items-center">
                  <div className="ml-4">
                    <p className="font-semibold">Ana Costa</p>
                    <p className="text-sm text-gray-500">Igreja Metodista Livre</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-church-red text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para transformar a gestão da sua igreja?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de igrejas que estão usando a <span className="font-bold text-yellow-200">Plataforma AltarHub</span> para simplificar sua administração.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-white text-church-red hover:bg-gray-100">
              Começar Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Plataforma AltarHub</h3>
              <div className="flex items-center gap-3 mb-4">
                <Logo size="sm" withText />
              </div>
              <p className="text-gray-400">
                A solução completa para gestão da sua igreja.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
                <li><Link to="/library" className="text-gray-400 hover:text-white">Biblioteca</Link></li>
                <li><Link to="/calendar" className="text-gray-400 hover:text-white">Agenda</Link></li>
                <li><Link to="/finance" className="text-gray-400 hover:text-white">Financeiro</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contato</h3>
              <p className="text-gray-400">
                contato@imw.com<br />
                (11) 1234-5678
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4 text-center text-gray-400">
            <p>&copy; 2025 Plataforma <span className="font-bold text-church-red">AltarHub</span>. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
