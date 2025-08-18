'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { FaCode, FaRobot, FaLaptopCode, FaTimes, FaWhatsapp, FaArrowRight } from 'react-icons/fa';

type ServiceKey = 'dev' | 'automation' | 'custom';

const CARDS: {
  key: ServiceKey;
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
}[] = [
  {
    key: 'dev',
    icon: <FaCode size={40} className="text-accent" />,
    title: 'Desenvolvimento Web',
    description: 'Sites e aplicações responsivas com foco em performance e conversão.',
    features: ['React/Next.js', 'Node.js API', 'Tailwind CSS', 'TypeScript'],
  },
  {
    key: 'automation',
    icon: <FaRobot size={40} className="text-accent" />,
    title: 'Automações',
    description: 'Elimine tarefas repetitivas e ganhe escala com fluxos automatizados.',
    features: ['Python / RPA', 'Workflows & Webhooks', 'Integrações (ERP/CRM/GA4)', 'Notificações/Relatórios'],
  },
  {
    key: 'custom',
    icon: <FaLaptopCode size={40} className="text-accent" />,
    title: 'Software Sob Demanda',
    description: 'Soluções personalizadas para necessidades específicas do seu negócio.',
    features: ['Arquitetura escalável', 'UI/UX personalizado', 'Cloud (Vercel/Render)', 'Suporte & Manutenção'],
  },
];

// conteúdo detalhado dos modais
const DETAILS: Record<
  ServiceKey,
  {
    headline: string;
    sub: string;
    benefits: string[];
    forWho: string[];
    deliverables: string[];
    timeline: string[];
  }
> = {
  dev: {
    headline: 'Sites e E-commerces que vendem mais',
    sub: 'Performance, SEO técnico e medição via GA4 para transformar visitantes em clientes.',
    benefits: [
      'Carregamento rápido (Lighthouse ≥ 95) e UX clara',
      'SEO on-page + dados estruturados',
      'Eventos GA4 (cliques, funis, scroll, leads)',
      'Integração de pagamento (Pix/Cartão) quando aplicável',
    ],
    forWho: [
      'Negócios locais que querem presença forte e geração de leads',
      'Lojas com estoque que precisam vender online',
      'Empreendedores digitais com landing pages de alta conversão',
    ],
    deliverables: [
      'Frontend em React/Next + Tailwind',
      'Formulário de orçamento com LGPD e anti-spam',
      'CTA WhatsApp com UTMs e rastreamento',
      'Sitemap/robots/OG + deploy em Vercel',
    ],
    timeline: ['Landing: 3–7 dias', 'Institucional: 7–14 dias', 'E-commerce: 2–4 semanas (dependências incluídas)'],
  },
  automation: {
    headline: 'Automações e integrações que economizam tempo',
    sub: 'RPA e integrações para reduzir custos operacionais e erros manuais.',
    benefits: [
      'Disparo automático de e-mails/WhatsApp',
      'ETL/Sync entre sistemas (ERP/CRM/Planilhas)',
      'Relatórios recorrentes e alertas',
      'Eventos GA4 para medir impacto das automações',
    ],
    forWho: [
      'Times enxutos com tarefas repetitivas',
      'Operações com muitos dados entre sistemas',
      'Empresas que querem padronizar processos',
    ],
    deliverables: [
      'Mapeamento de processo (BPMN light)',
      'Bots/Workers (Python/Node) e webhooks',
      'Painel simples de status/logs',
      'Documentação de fallback e segurança',
    ],
    timeline: ['POC: 3–5 dias', 'Fluxo completo: 1–3 semanas (conforme escopo)'],
  },
  custom: {
    headline: 'Software sob medida que acompanha seu crescimento',
    sub: 'Arquitetura escalável, UX sob medida e roadmap evolutivo.',
    benefits: [
      'MVP rápido (React + Node + MongoDB)',
      'RBAC e autenticação (JWT/OAuth)',
      'Multi-tenant opcional (SaaS)',
      'Observabilidade básica + GA4 em eventos chave',
    ],
    forWho: [
      'Startups em validação de mercado',
      'Empresas com necessidades específicas',
      'Negócios que precisam de integrações complexas',
    ],
    deliverables: [
      'API REST/GraphQL + banco (MongoDB)',
      'Design system básico e componentes',
      'CI/CD e deploy (Vercel/Render)',
      'Plano de medição (eventos GA4 e KPIs)',
    ],
    timeline: ['MVP navegável: 2–5 semanas (escopo guiado por priorização)'],
  },
};

export default function ServicesSection() {
  const [openKey, setOpenKey] = useState<ServiceKey | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const y = useMotionValue(0);

  // detectar mobile
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  const waHref = useMemo(() => {
    const phone = '5579998807035';
    const text = encodeURIComponent('Olá! Vim pelo site da DevSolution Inovadora e quero solicitar um orçamento.');
    const utms = new URLSearchParams({
      utm_source: 'site',
      utm_medium: 'services_modal_cta',
      utm_campaign: 'lead_devsolution',
    }).toString();
    return `https://wa.me/${phone}?text=${text}&${utms}`;
  }, []);

  // trava o fundo
  useEffect(() => {
    if (!openKey) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setTimeout(() => dialogRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openKey]);

  // ESC para fechar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenKey(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
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
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-primary mb-4">Nossos Serviços</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Soluções completas para transformar sua presença digital — com foco em performance, SEO e mensuração (GA4).
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CARDS.map((service, index) => (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-primary mb-2">{service.title}</h3>
              <p className="text-secondary mb-4">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                    <span className="text-sm">{feature}</span>
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
                  href={waHref}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-primary text-light hover:opacity-90 transition"
                  data-gtag="click_whatsapp"
                >
                  <FaWhatsapp className="text-base" />
                  Orçamento
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal (desktop) / Bottom Sheet (mobile) */}
      <AnimatePresence>
        {openKey && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            onClick={() => setOpenKey(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Sheet / Modal container */}
            <motion.div
              id={`dialog-${openKey}`}
              ref={dialogRef}
              tabIndex={-1}
              className={[
                'relative bg-white text-primary shadow-xl focus:outline-none',
                // compacto e adaptável no mobile
                'w-[95%] sm:w-auto',
                'max-h-[70dvh] sm:max-h-none',
                'rounded-t-xl sm:rounded-2xl',
                'mx-auto',
                'flex flex-col overscroll-contain',
              ].join(' ')}
              onClick={(e) => e.stopPropagation()}
              initial={isMobile ? { y: 28, opacity: 1 } : { y: 20, opacity: 0 }}
              animate={isMobile ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
              exit={isMobile ? { y: 50, opacity: 1 } : { y: 10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              drag={isMobile ? 'y' : false}
              dragDirectionLock
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.55 }}
              style={{ y }}
              onDragEnd={isMobile ? handleDragEnd : undefined}
            >
              {/* Header mobile com handle e X */}
              <div className="sm:hidden sticky top-0 z-10 bg-white">
                <button
                  className="absolute top-2 right-2 p-2 rounded-lg text-secondary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent"
                  onClick={() => setOpenKey(null)}
                  aria-label="Fechar modal"
                >
                  <FaTimes />
                </button>
                <div className="flex flex-col items-center pt-2 pb-2">
                  <span className="h-1.5 w-10 rounded-full bg-gray-300" aria-hidden />
                </div>
              </div>

              {/* Botão X desktop */}
              <button
                className="hidden sm:inline-flex absolute top-3 right-3 p-2 rounded-lg text-secondary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent"
                onClick={() => setOpenKey(null)}
                aria-label="Fechar modal"
              >
                <FaTimes />
              </button>

              {/* Conteúdo: mobile = accordions compactos; desktop = grid completo */}
              <div
                className={[
                  // padding reduzido no mobile
                  'px-4 py-3 sm:p-8',
                  // ESSENCIAL: ocupa espaço restante e permite scroll
                  'min-h-0 flex-1 overflow-y-auto',
                  // espaço para não colidir com o footer sticky do mobile
                  'pb-20 sm:pb-8',
                ].join(' ')}
                style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
              >
                {(() => {
                  const d = DETAILS[openKey];
                  return (
                    <>
                      <h3 className="text-lg sm:text-2xl font-bold mb-2">{d.headline}</h3>
                      <p className="text-secondary text-sm sm:text-base mb-4 sm:mb-6">{d.sub}</p>

                      {isMobile ? (
                        <div className="space-y-2">
                          <details className="rounded-lg border p-2">
                            <summary className="font-semibold text-sm cursor-pointer select-none">Benefícios</summary>
                            <ul className="mt-2 space-y-1.5 text-sm pl-4 list-disc">
                              {d.benefits.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          </details>
                          <details className="rounded-lg border p-2">
                            <summary className="font-semibold text-sm cursor-pointer select-none">Para quem é</summary>
                            <ul className="mt-2 space-y-1.5 text-sm pl-4 list-disc">
                              {d.forWho.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          </details>
                          <details className="rounded-lg border p-2">
                            <summary className="font-semibold text-sm cursor-pointer select-none">Entregáveis</summary>
                            <ul className="mt-2 space-y-1.5 text-sm pl-4 list-disc">
                              {d.deliverables.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          </details>
                          <details className="rounded-lg border p-2">
                            <summary className="font-semibold text-sm cursor-pointer select-none">Prazos típicos</summary>
                            <ul className="mt-2 space-y-1.5 text-sm pl-4 list-disc">
                              {d.timeline.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          </details>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-2">Benefícios</h4>
                            <ul className="space-y-2 text-sm">
                              {d.benefits.map((b, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="mt-2 mr-2 w-2 h-2 bg-accent rounded-full"></span>
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
                                  <span className="mt-2 mr-2 w-2 h-2 bg-accent rounded-full"></span>
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
                                  <span className="mt-2 mr-2 w-2 h-2 bg-accent rounded-full"></span>
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
                                  <span className="mt-2 mr-2 w-2 h-2 bg-accent rounded-full"></span>
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Footer mobile: APENAS CTA principal (WhatsApp) */}
              <div className="sm:hidden sticky bottom-0 z-10 bg-white/95 backdrop-blur border-t px-3 py-2">
                <a
                  href={waHref}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold bg-accent text-black hover:opacity-90 transition"
                  data-gtag="click_whatsapp"
                >
                  <FaWhatsapp className="text-base" />
                  WhatsApp
                </a>
              </div>

              {/* Footer desktop (como antes) */}
              <div className="hidden sm:flex px-8 pb-8 pt-4 gap-3">
                <a
                  href={waHref}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-accent text-black hover:opacity-90 transition"
                  data-gtag="click_whatsapp"
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
