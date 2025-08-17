'use client';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: "Antonio de Pádua",
    position: "CEO, Empresa Ideal Administração de imoveis",
    content: "A Landing Page desenvolvida revolucionou nossa operação, aumentando a eficiência em 40% de capitação de novos clientes .",
    rating: 5
  },
  // Adicione mais 2-3 depoimentos
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-primary text-light">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Avaliações de Clientes</h2>
          <p className="max-w-2xl mx-auto opacity-90">
            Veja o que nossos clientes dizem sobre nossos serviços
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-secondary p-6 rounded-lg"
            >
              <FaQuoteLeft className="text-accent mb-4" size={24} />
              <p className="mb-6 italic">{testimonial.content}</p>
              
              <div className="flex items-center gap-4">
                <div className="bg-accent w-12 h-12 rounded-full flex items-center justify-center">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-sm opacity-80">{testimonial.position}</p>
                </div>
              </div>
              
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`text-lg ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-500'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}