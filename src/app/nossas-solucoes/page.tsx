'use client';

import type { ReactNode, CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import {
  FaStore, FaShoppingCart, FaRocket, FaLightbulb,
  FaWhatsapp, FaTimes
} from 'react-icons/fa';

// Se quiser usar a rota em outros lugares, mova para src/lib/routes.ts
// export const ROUTE_NOSSAS_SOLUCOES = '/nossas-solucoes';

type Offer = {
  id: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  outcomes: string[];
  solutions: string[];
  kpis: string[];
  stack: string[];
};

const OFFERS: Offer[] = [
  {
    id: 'locals',
    icon: <FaStore className="text-accent" size={28} />,
    title: 'Negócios Locais',
    subtitle: 'Restaurantes, clínicas, oficinas, academias…',
    outcomes: ['Gere leads e pedidos direto no WhatsApp', 'Apareça no Google com SEO técnico', 'Página rápida que aumenta conversão'],
    solutions: ['Site institucional/landing com CTA', 'Cardápio digital e pedidos online', 'Eventos GA4 (cliques, funil, scroll)'],
    kpis: ['+40% em pedidos com cardápio + tráfego', 'Tempo de carregamento < 2s', 'Eventos GA4 100% configurados'],
    stack: ['React/Next', 'Tailwind', 'Node', 'GA4', 'Vercel'],
  },
  {
    id: 'stock',
    icon: <FaShoppingCart className="text-accent" size={28} />,
    title: 'Lojas/Empresas com Estoque',
    subtitle: 'Autopeças, eletrônicos, móveis, distribuidoras…',
    outcomes: ['Venda online com autonomia', 'Controle de catálogo e pedidos', 'Integração com transporte e pagamento'],
    solutions: ['E-commerce completo (Pix/Cartão)', 'Dashboard de vendas e clientes', 'Integrações (frete/ERP/WhatsApp API)'],
    kpis: ['↑ taxa de conversão com UX + performance', 'Funil GA4: visita → produto → checkout', 'Redução de custo por venda (orgânico + pago)'],
    stack: ['React/Next', 'Node API', 'MongoDB', 'GA4', 'Render/Vercel'],
  },
  {
    id: 'creators',
    icon: <FaLightbulb className="text-accent" size={28} />,
    title: 'Empreendedores Digitais',
    subtitle: 'Infoprodutos, consultorias, SaaS solo…',
    outcomes: ['Páginas que convertem com provas sociais', 'Captação e remarketing estruturados', 'Escalável para tráfego pago'],
    solutions: ['Landing de alta conversão (A/B pronto)', 'Área de membros/assinatura', 'Eventos GA4 (leads, checkout, upsell)'],
    kpis: ['↑ CTR e ↓ CPL em campanhas', 'Rastreio de funil por criativo', 'Tempo de publicação rápido'],
    stack: ['React/Next', 'Tailwind', 'Gateways recorrentes', 'GA4'],
  },
  {
    id: 'startups',
    icon: <FaRocket className="text-accent" size={28} />,
    title: 'Startups e MVP',
    subtitle: 'Validação de produto e captação',
    outcomes: ['MVP navegável rápido', 'Arquitetura escalável (multi-tenant opcional)', 'Medição de uso para roadmap'],
    solutions: ['SPA/SSR + API (REST/GraphQL)', 'Auth JWT/OAuth + RBAC', 'Observabilidade básica + GA4'],
    kpis: ['Time-to-market em semanas', 'Eventos de ativação/retenção configurados', 'Base pronta para pivôs'],
    stack: ['React/Next', 'Node', 'MongoDB', 'GA4', 'CI/CD'],
  },
];

// Hook simples para mobile (<= 767px)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return isMobile;
}

export default function WhatWeDoSection() {
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState<string>(OFFERS[0].id);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const y = useMotionValue(0);

  const waHref = useMemo(() => {
    const phone = '5579998807035';
    const text = encodeURIComponent('Olá! Vim pelo site da DevSolution Inovadora e quero solicitar um orçamento.');
    const utms = new URLSearchParams({ utm_source: 'site', utm_medium: 'whatwedo_cta', utm_campaign: 'lead_devsolution' }).toString();
    return `https://wa.me/${phone}?text=${text}&${utms}`;
  }, []);

  // ESC + trava o fundo enquanto o sheet estiver aberto
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(null); };
    document.addEventListener('keydown', onKey);

    let prevOverflow = '';
    if (mobileOpen) {
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setTimeout(() => dialogRef.current?.focus(), 0);
    }

    return () => {
      document.removeEventListener('keydown', onKey);
      if (mobileOpen) document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  const active = OFFERS.find(o => o.id === selected)!;
  const mobileActive = mobileOpen ? OFFERS.find(o => o.id === mobileOpen)! : null;

  const handleCardClick = (id: string) => {
    if (isMobile) {
      if (mobileOpen) return;
      setMobileOpen(id);
    } else {
      setSelected(id);
    }
  };

  const handleDragEnd = (_: any, info: { offset: { y: number }; velocity: { y: number } }) => {
    const dragged = info.offset.y;
    const velo = info.velocity.y;
    if (dragged > 120 || velo > 800) {
      setMobileOpen(null);
      y.set(0);
    } else {
      y.set(0);
    }
  };

  return (
    // Compensa header fixo: margem-top + offset de âncora
    <section id="nossas-solucoes" className="bg-white mt-14 md:mt-16 scroll-mt-20 md:scroll-mt-24">
      {/* BANNER (vídeo em loop infinito) */}
      <div className="relative w-full h-40 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/Banner_Nossas_SoluçõesVD.mp4" type="video/mp4" />
          {/*
            Se preferir evitar acentos no nome do arquivo, renomeie e troque a linha acima.
            Ex.: <source src="/Banner_Nossas_SolucoesVD.mp4" type="video/mp4" />
          */}
        </video>
      </div>

      {/* TÍTULO E SUBTÍTULO (fora do banner, logo abaixo) */}
      <div className="max-w-6xl mx-auto px-4 pt-6 sm:pt-8">
        <motion.div initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">Nossas Soluções</h1>
          <p className="text-secondary mt-2 text-sm sm:text-base">
            Projetos sob medida com performance, SEO e mensuração (GA4).
          </p>
        </motion.div>
      </div>

      {/* CONTEÚDO */}
      <div className="py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4">
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {OFFERS.map((o) => {
              const isSel = o.id === selected;
              return (
                <motion.button
                  key={o.id}
                  onClick={() => handleCardClick(o.id)}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={[
                    'text-left rounded-xl p-4 shadow-md transition w-full',
                    isSel && !isMobile ? 'bg-light ring-2 ring-accent' : 'bg-white hover:shadow-lg'
                  ].join(' ')}
                  aria-pressed={!isMobile && isSel}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {o.icon}
                    <h3 className="text-lg font-semibold text-primary">{o.title}</h3>
                  </div>
                  <p className="text-secondary text-sm">{o.subtitle}</p>
                </motion.button>
              );
            })}
          </div>

          {/* Painel detalhado (DESKTOP apenas) */}
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-light rounded-2xl p-6 shadow-md hidden md:block"
          >
            <DetailsBlock offer={active} waHref={waHref} />
          </motion.div>
        </div>
      </div>

      {/* Bottom Sheet MOBILE (compacto + accordions + footer CTA + swipe-down) */}
      <AnimatePresence>
        {mobileActive && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end justify-center md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            onClick={() => setMobileOpen(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Sheet */}
            <motion.div
              ref={dialogRef}
              tabIndex={-1}
              className={[
                'relative bg-white text-primary shadow-xl focus:outline-none',
                'w-[95%] max-w-md mx-auto',
                'max-h-[70dvh]',
                'rounded-t-xl',
                'flex flex-col overscroll-contain',
              ].join(' ')}
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 28, opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 48, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              drag="y"
              dragDirectionLock
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.55 }}
              style={{ y }}
              onDragEnd={handleDragEnd}
            >
              {/* Header compacto + handle + X */}
              <div className="sticky top-0 z-10 bg-white">
                <button
                  className="absolute top-2 right-2 p-2 rounded-lg text-secondary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent"
                  onClick={() => setMobileOpen(null)}
                  aria-label="Fechar"
                >
                  <FaTimes />
                </button>
                <div className="flex flex-col items-center pt-2 pb-2">
                  <span className="h-1.5 w-10 rounded-full bg-gray-300" aria-hidden />
                </div>
                <div className="px-4 pb-2">
                  <h4 className="text-lg font-bold">{mobileActive.title}</h4>
                  <p className="text-secondary text-sm">{mobileActive.subtitle}</p>
                </div>
              </div>

              {/* Conteúdo rolável com accordions (compact) */}
              <div
                className="min-h-0 flex-1 overflow-y-auto px-4 pb-20"
                style={{ WebkitOverflowScrolling: 'touch' } as CSSProperties}
              >
                <DetailsBlock offer={mobileActive} waHref={waHref} compact />
              </div>

              {/* Footer sticky (apenas CTA principal) */}
              <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur border-t px-3 py-2">
                <a
                  href={waHref}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold bg-accent text-black hover:opacity-90 transition"
                  data-gtag="click_whatsapp"
                >
                  <FaWhatsapp className="text-base" />
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* --- BLOCO REUTILIZÁVEL --- */
function DetailsBlock({
  offer,
  waHref,
  compact = false,
}: {
  offer: Offer;
  waHref: string;
  compact?: boolean;
}) {
  // Versão compacta (MOBILE): accordions e sem CTA interno (CTA fica no footer do sheet)
  if (compact) {
    return (
      <div className="space-y-2">
        <details className="rounded-lg border p-2">
          <summary className="font-semibold text-sm cursor-pointer select-none">Resultados que você pode esperar</summary>
          <ul className="mt-2 space-y-1.5 text-sm pl-4 list-disc">
            {offer.outcomes.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </details>

        <details className="rounded-lg border p-2">
          <summary className="font-semibold text-sm cursor-pointer select-none">O que entregamos</summary>
          <ul className="mt-2 space-y-1.5 text-sm pl-4 list-disc">
            {offer.solutions.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          <div className="mt-3">
            <p className="text-xs uppercase tracking-wide text-secondary/70 mb-1">Stack</p>
            <div className="flex flex-wrap gap-2">
              {offer.stack.map((t, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-white text-primary text-xs shadow-sm">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </details>

        <details className="rounded-lg border p-2">
          <summary className="font-semibold text-sm cursor-pointer select-none">KPIs típicos</summary>
          <ul className="mt-2 space-y-1.5 text-sm pl-4 list-disc">
            {offer.kpis.map((k, i) => <li key={i}>{k}</li>)}
          </ul>
        </details>

        <p className="text-secondary text-xs">Aracaju-SE • Atendemos todo o Brasil</p>
      </div>
    );
  }

  // Versão completa (DESKTOP)
  return (
    <div>
      <header className="mb-5">
        <div className="flex items-center gap-3 mb-1">
          {offer.icon}
          <h4 className="text-xl font-bold text-primary">{offer.title}</h4>
        </div>
        <p className="text-secondary">{offer.subtitle}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div>
          <h5 className="text-lg font-semibold text-primary mb-2">Resultados que você pode esperar</h5>
          <ul className="space-y-2">
            {offer.outcomes.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="mt-2 mr-2 w-2 h-2 bg-accent rounded-full" />
                <span className="text-secondary">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-lg font-semibold text-primary mb-2">O que entregamos</h5>
          <ul className="space-y-2">
            {offer.solutions.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="mt-2 mr-2 w-2 h-2 bg-accent rounded-full" />
                <span className="text-secondary">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <p className="text-xs uppercase tracking-wide text-secondary/70 mb-1">Stack</p>
            <div className="flex flex-wrap gap-2">
              {offer.stack.map((t, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-white text-primary text-xs shadow-sm">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h5 className="text-lg font-semibold text-primary mb-2">KPIs típicos</h5>
          <ul className="space-y-2 mb-5">
            {offer.kpis.map((k, i) => (
              <li key={i} className="flex items-start">
                <span className="mt-2 mr-2 w-2 h-2 bg-accent rounded-full" />
                <span className="text-secondary">{k}</span>
              </li>
            ))}
          </ul>

          <a
            href={waHref}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-accent text-black hover:opacity-90 transition"
            data-gtag="click_whatsapp"
          >
            <FaWhatsapp className="text-base" />
            Falar sobre este projeto
          </a>

          <p className="text-secondary text-xs mt-3">Aracaju-SE • Atendemos todo o Brasil</p>
        </div>
      </div>
    </div>
  );
}
