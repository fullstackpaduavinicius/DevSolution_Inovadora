'use client';

import { useMemo } from 'react';
import { FaUserTie, FaLightbulb, FaHandshake, FaChartLine, FaBolt, FaShieldAlt, FaWhatsapp } from 'react-icons/fa';
import SectionTitle from '@/components/ui/SectionTitle';

export default function AboutPage() {
  const waHref = useMemo(() => {
    const phone = '5579998807035';
    const text = encodeURIComponent('Olá! Vim pelo site da DevSolution Inovadora e quero solicitar um orçamento.');
    const utms = new URLSearchParams({
      utm_source: 'site',
      utm_medium: 'about_cta',
      utm_campaign: 'lead_devsolution',
    }).toString();
    return `https://wa.me/${phone}?text=${text}&${utms}`;
  }, []);

  return (
    <main className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Título + introdução */}
        <SectionTitle title="" subtitle="" />

        {/* Intro + imagem */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">Quem somos</h3>
            <p className="text-secondary mb-4">
              A <span className="font-semibold">DevSolution Inovadora</span> nasceu da paixão por transformar ideias em
              soluções digitais reais. Sites modernos, e-commerces completos e sistemas sob medida, sempre orientados a
              performance e conversão.
            </p>
            <p className="text-secondary mb-4">
              Com origem em <span className="font-semibold">Aracaju-SE</span>, atendemos clientes em todo o Brasil com um
              processo de trabalho claro, comunicação direta e entregas mensuráveis.
            </p>

            {/* Destaques rápidos */}
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li className="flex items-start gap-3">
                <FaChartLine className="text-accent mt-1" />
                <div>
                  <p className="text-primary font-medium">Orientado a dados</p>
                  <p className="text-secondary text-sm">Eventos e funis no GA4 para cada projeto.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaBolt className="text-accent mt-1" />
                <div>
                  <p className="text-primary font-medium">Alta performance</p>
                  <p className="text-secondary text-sm">Boas práticas e Lighthouse como meta.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaShieldAlt className="text-accent mt-1" />
                <div>
                  <p className="text-primary font-medium">Segurança</p>
                  <p className="text-secondary text-sm">Auth (JWT/OAuth), RBAC e headers protegidos.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Imagem equipe/mockup */}
          <div className="bg-gray-100 h-64 md:h-80 rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src="/foldersobrenos.png"
              alt="Equipe e projetos da DevSolution Inovadora"
              className="w-full h-full object-contain"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </section>

        {/* Missão, Visão, Valores */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <FaUserTie size={40} className="text-accent" />,
              title: 'Missão',
              text: 'Entregar soluções tecnológicas personalizadas que impulsionem vendas e eficiência dos nossos clientes.',
            },
            {
              icon: <FaLightbulb size={40} className="text-accent" />,
              title: 'Visão',
              text: 'Ser referência em desenvolvimento de software, automações e e-commerce com foco em dados.',
            },
            {
              icon: <FaHandshake size={40} className="text-accent" />,
              title: 'Valores',
              text: 'Transparência, qualidade técnica, inovação contínua e parceria de longo prazo.',
            },
          ].map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">{item.icon}</div>
              <h4 className="text-xl font-bold text-primary mb-2">{item.title}</h4>
              <p className="text-secondary">{item.text}</p>
            </div>
          ))}
        </section>

        {/* Como trabalhamos (método em 4 etapas) */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-primary mb-4">Como trabalhamos</h3>
          <ol className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1. Descoberta', text: 'Entendimento do negócio, metas e público. Definição de KPIs.' },
              { step: '2. Planejamento', text: 'Arquitetura, backlog e plano de medição (GA4 + eventos).' },
              { step: '3. Implementação', text: 'Desenvolvimento com entregas iterativas e testes.' },
              { step: '4. Go-live & Acompanhamento', text: 'Deploy (Vercel), QA, SEO técnico e ajustes baseados em dados.' },
            ].map((s, i) => (
              <li key={i} className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-primary font-semibold mb-1">{s.step}</p>
                <p className="text-secondary text-sm">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* KPIs + logos de clientes */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { k: '+30', label: 'Projetos entregues' },
              { k: '5+', label: 'Estados atendidos' },
              { k: '95+', label: 'Lighthouse médio (alvos)' },
              { k: '100%', label: 'Eventos GA4 configurados' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-3xl font-extrabold text-primary">{item.k}</p>
                <p className="text-secondary text-sm mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-secondary mb-3">Algumas marcas que confiam no nosso trabalho:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
              {/* Substituir pelos logos reais (SVG/PNG) */}
              <div className="h-12 bg-gray-100 rounded-md" />
              <div className="h-12 bg-gray-100 rounded-md" />
              <div className="h-12 bg-gray-100 rounded-md" />
              <div className="h-12 bg-gray-100 rounded-md" />
            </div>
          </div>
        </section>

        {/* Stack & padrões (opcional, agrega autoridade técnica) */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-primary mb-4">Stack & Padrões</h3>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-secondary">
              Utilizamos <span className="font-medium">React/Next.js, Node.js, TailwindCSS e MongoDB</span>, com boas práticas de segurança
              (Helmet, Rate Limit), acessibilidade, SEO técnico e mensuração via GA4. Integramos meios de pagamento (Pix/Cartão),
              automações (RPA/API) e serviços em nuvem (Vercel/Render).
            </p>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-primary text-light rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-bold mb-1">Vamos criar algo que gere resultado?</h4>
            <p className="text-light/80">
              Fale no WhatsApp e receba uma proposta rápida com prazos e entregáveis claros.
            </p>
          </div>
          <a
            href={waHref}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-accent text-black hover:opacity-90 transition"
            data-gtag="click_whatsapp"
          >
            <FaWhatsapp className="text-base" />
            Falar no WhatsApp
          </a>
        </section>
      </div>
    </main>
  );
}
