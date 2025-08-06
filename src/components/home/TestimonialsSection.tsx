
import React from 'react';
import TestimonialCard from './TestimonialCard';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      testimonial: "O módulo de biblioteca revolucionou nossa gestão de livros. Conseguimos reduzir as perdas e aumentar o engajamento da comunidade com a leitura.",
      name: "Pastor Eduardo",
      church: "Igreja Batista Central"
    },
    {
      testimonial: "A gestão financeira ficou muito mais transparente e organizada. Os relatórios são claros e nos ajudam a tomar decisões estratégicas.",
      name: "Marcos Silva",
      church: "Igreja Presbiteriana Renovada"
    },
    {
      testimonial: "O calendário integrado acabou com os conflitos de agenda e melhorou muito nossa comunicação interna. Recomendo a todas as igrejas!",
      name: "Ana Costa",
      church: "Igreja Metodista Livre"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-church-blue mb-4">Depoimentos</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Veja o que nossos usuários dizem sobre o ChurchConnect Nexus.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial.testimonial}
              name={testimonial.name}
              church={testimonial.church}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
