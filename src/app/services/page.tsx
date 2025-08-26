'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useReducedMotion } from 'framer-motion';
import { FaCode, FaRobot, FaLaptopCode, FaTimes, FaArrowRight, FaShieldAlt, FaCheck, FaWhatsapp } from 'react-icons/fa';

type ServiceKey = 'dev' | 'automation' | 'custom';

type Card = {
  key: ServiceKey;
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  tag?: string;
};

const CARDS: Card[] = [
  {
    key: 'dev',
    icon: <FaCode size={40} className="text-accent" />,
    title: 'Desenvolvimento Web',
    description: 'Sites, LPs e e-commerces com foco em conversão, SEO e mensuração.',
    features: [
      'React / Next.js + Tailwind',
      'SEO técnico + dados estruturados',
      'GA4: eventos, funis e UTMs',
      'Integração de pagamento (quando aplicável)',
    ],
    tag: 'Sob medida',
  },
  {
    key: 'automation',
    icon: <FaRobot size={40} className="text-accent" />,
    title: 'Automações',
    description: 'Elimine tarefas repetitivas e ganhe escala com RPA e integrações.',
    features: [
      'Bots/Workers (Python/Node)',
      'Webhooks + ETL entre sistemas',
      'Alertas e relatórios recorrentes',
      'GA4 para medir impacto',
    ],
    tag: 'Eficiência',
  },
  {
    key: 'custom',
    icon: <FaLaptopCode size={40} className="text-accent" />,
    title: 'Software Sob Demanda',
    description: 'MVPs, painéis e sistemas com arquitetura escalável e UX personalizada.',
    features: [
      'API REST/GraphQL + DB (MongoDB)',
      'RBAC + autenticação (JWT/OAuth)',
      'Multi-tenant (SaaS) opcional',
      'Observabilidade + GA4 em eventos-chave',
    ],
    tag: 'Escalável',
  },
];

const DETAILS: Record<
  ServiceKey,
  {
    headline: string;
    sub: string;
    benefits: string[];
    forWho: string[];
    deliverables: string[];
    timeline: string[];
    extras?: string[];
  }
> = {
  dev: {
    headline: 'Sites e E-commerces orientados a resultado',
    sub: 'Velocidade, SEO técnico e GA4 para transformar tráfego em receita.',
    benefits: [
      'UX clara + carregamento rápido (Lighthouse ≥ 95)',
      'SEO on-page + dados estruturados (rich results)',
      'Eventos GA4: cliques, funis, leads, scroll e KPIs',
      'Integrações com meios de pagamento (Pix/Cartão)',
    ],
    forWho: [
      'Negócios que precisam gerar leads todos os dias',
      'Lojas que vendem online e querem escala com performance',
      'Operações que precisam de mensuração confiável (GA4)',
    ],
    deliverables: [
      'Frontend React/Next + Tailwind, hospedagem Vercel',
      'Formulários com LGPD, anti-spam e UTMs',
      'Sitemap/robots/OG + monitoramento básico',
      'Plano de medição (GA4) + painel de métricas inicial',
    ],
    timeline: ['Landing: 3–7 dias', 'Institucional: 7–14 dias', 'E-commerce: 2–4 semanas (dependências incluídas)'],
    extras: ['Pós-projeto: manutenção e banco de horas opcional'],
  },
  automation: {
    headline: 'Automações e integrações que economizam tempo',
    sub: 'RPA e sincronizações para reduzir custos operacionais e erros manuais.',
    benefits: [
      'Workflows com webhooks e filas confiáveis',
      'ETL/Sync entre ERP, CRM e planilhas',
      'Relatórios automáticos e alertas acionáveis',
      'Eventos GA4 para medir impacto operacional',
    ],
    forWho: [
      'Times enxutos com tarefas repetitivas',
      'Operações com alto volume de dados',
      'Empresas que precisam padronizar processos',
    ],
    deliverables: [
      'Mapeamento de processo (BPMN light)',
      'Bots/Workers (Python/Node) + documentação de fallback',
      'Painel simples de status/logs',
      'Plano de observabilidade e segurança básica',
    ],
    timeline: ['POC: 3–5 dias', 'Fluxo completo: 1–3 semanas (conforme escopo)'],
    extras: ['Suporte evolutivo via banco de horas'],
  },
  custom: {
    headline: 'Software sob medida que cresce com o seu negócio',
    sub: 'Roadmap evolutivo, arquitetura escalável e UX personalizada.',
    benefits: [
      'Entrega rápida de MVP (React + Node + MongoDB)',
      'Autenticação e RBAC alinhados ao compliance',
      'Multi-tenant opcional para SaaS',
      'Métricas de produto (GA4) desde o v1',
    ],
    forWho: [
      'Startups em validação de mercado',
      'Empresas com requisitos específicos',
      'Operações que exigem integrações complexas',
    ],
    deliverables: [
      'API REST/GraphQL, banco modelado e seeds',
      'Design system básico + componentes',
      'CI/CD + deploy (Vercel/Render)',
      'Plano de KPIs e eventos GA4 por jornada',
    ],
    timeline: ['MVP navegável: 2–5 semanas (priorização guidada)'],
    extras: ['SLA e evolução via contrato de horas'],
  },
};

export default function ServicesSection() {
  const [openKey, setOpenKey] = useState<ServiceKey | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const y = useMotionValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  const handleDragEnd = (_: any, info: { offset: { y: number }; velocity: { y: number } }) => {
    const dragged = info.offset.y;
    const velo = info.velocity.y;
    if (dragged > 120 || velo > 800) {
      setOpenKey(null);
      y.set(0);
    } else {
      y.set(0);
    }
  };

  return (
    <section className="py-16 bg-light">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-primary mb-3">Nossos Serviços</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Projetos digitais sob medida com foco em performance, SEO técnico e mensuração (GA4).
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium">
            <FaShieldAlt className="opacity-80" />
            <span>Parceria de negócios • Atendimento nacional • Orçamento exclusivo</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CARDS.map((service, index) => (
            <motion.article
              key={service.key}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col border border-gray-100"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>{service.icon}</div>
                {service.tag && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent/20 text-primary font-semibold">
                    {service.tag}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">{service.title}</h3>
              <p className="text-secondary mb-4">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <FaCheck className="mt-0.5 mr-2 opacity-70" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex gap-3">
                <button
                  onClick={() => setOpenKey(service.key)}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-accent text-black hover:opacity-90 transition"
                  aria-haspopup="dialog"
                  aria-controls={`dialog-${service.key}`}
                >
                  Saiba mais <FaArrowRight className="text-xs" />
                </button>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-primary text-light hover:opacity-90 transition"
                >
                  <FaWhatsapp className="text-base" />
                  Orçamento
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 text-center text-xs text-secondary">
          <p>
            <strong>Sem planos fechados.</strong> Cada projeto é orçado de forma exclusiva, com estimativa de esforço e
            cronograma alinhados aos objetivos de negócio.
          </p>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {openKey && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`dialog-title-${openKey}`}
            onClick={() => setOpenKey(null)}
          >
            <div className="absolute inset-0 bg-black/60" />
            <motion.div
              id={`dialog-${openKey}`}
              ref={dialogRef}
              tabIndex={-1}
              className="relative bg-white text-primary shadow-xl w-[95%] sm:w-auto max-h-[70dvh] sm:max-h-none rounded-t-2xl sm:rounded-2xl mx-auto flex flex-col overscroll-contain border border-gray-100"
              onClick={(e) => e.stopPropagation()}
              initial={isMobile ? { y: 28, opacity: 1 } : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={isMobile ? { y: 50, opacity: 1 } : { y: 10, opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 22 }}
              drag={isMobile ? 'y' : false}
              dragDirectionLock
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.55 }}
              style={{ y }}
              onDragEnd={isMobile ? handleDragEnd : undefined}
            >
              {/* Header */}
              <div className="sm:hidden sticky top-0 z-10 bg-white">
                <button
                  className="absolute top-2 right-2 p-2 rounded-lg text-secondary hover:bg-gray-100"
                  onClick={() => setOpenKey(null)}
                  aria-label="Fechar modal"
                >
                  <FaTimes />
                </button>
                <div className="flex flex-col items-center pt-2 pb-2">
                  <span className="h-1.5 w-10 rounded-full bg-gray-300" />
                </div>
              </div>
              <button
                className="hidden sm:inline-flex absolute top-3 right-3 p-2 rounded-lg text-secondary hover:bg-gray-100"
                onClick={() => setOpenKey(null)}
                aria-label="Fechar modal"
              >
                <FaTimes />
              </button>

              <div className="px-4 py-3 sm:p-8 min-h-0 flex-1 overflow-y-auto pb-20 sm:pb-8">
                {(() => {
                  const d = DETAILS[openKey];
                  return (
                    <>
                      <h3 id={`dialog-title-${openKey}`} className="text-lg sm:text-2xl font-bold mb-2">
                        {d.headline}
                      </h3>
                      <p className="text-secondary text-sm sm:text-base mb-4 sm:mb-6">{d.sub}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Benefícios</h4>
                          <ul className="space-y-2 text-sm">
                            {d.benefits.map((b, i) => (
                              <li key={i} className="flex items-start">
                                <span className="mt-2 mr-2 w-2 h-2 bg-accent rounded-full" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Para quem é</h4>
                          <ul className="space-y-2 text-sm">
                            {d.forWho.map((b, i) => (
                              <li key={i} className="flex items-start">
                                <span className="mt-2 mr-2 w-2 h-2 bg-accent rounded-full" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Entregáveis</h4>
                          <ul className="space-y-2 text-sm">
                            {d.deliverables.map((b, i) => (
                              <li key={i} className="flex items-start">
                                <span className="mt-2 mr-2 w-2 h-2 bg-accent rounded-full" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Prazos típicos</h4>
                          <ul className="space-y-2 text-sm">
                            {d.timeline.map((b, i) => (
                              <li key={i} className="flex items-start">
                                <span className="mt-2 mr-2 w-2 h-2 bg-accent rounded-full" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {d.extras && (
                          <div>
                            <h4 className="font-semibold mb-2">Extras</h4>
                            <ul className="space-y-2 text-sm">
                              {d.extras.map((b, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="mt-2 mr-2 w-2 h-2 bg-accent rounded-full" />
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Footer mobile */}
              <div className="sm:hidden sticky bottom-0 z-10 bg-white/95 backdrop-blur border-t px-3 py-2">
                <a
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold bg-accent text-black hover:opacity-90 transition"
                >
                  <FaWhatsapp className="text-base" />
                  Falar no formulário
                </a>
              </div>

              {/* Footer desktop */}
              <div className="hidden sm:flex px-8 pb-8 pt-4 gap-3">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-accent text-black hover:opacity-90 transition"
                >
                  <FaWhatsapp className="text-base" />
                  Solicitar orçamento
                </a>
                <button
                  onClick={() => setOpenKey(null)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-primary text-light hover:opacity-90 transition"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
