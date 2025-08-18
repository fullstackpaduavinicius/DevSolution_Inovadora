'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaStore, FaShoppingCart, FaRocket, FaLightbulb,
  FaWhatsapp, FaTimes
} from 'react-icons/fa';

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

// Hook simples para saber se está em mobile (<= 767px)
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
  const [selected, setSelected] = useState<string>(OFFERS[0].id);      // painel desktop
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);   // modal mobile
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const waHref = useMemo(() => {
    const phone = '5579998807035';
    const text = encodeURIComponent('Olá! Vim pelo site da DevSolution Inovadora e quero solicitar um orçamento.');
    const utms = new URLSearchParams({ utm_source: 'site', utm_medium: 'whatwedo_cta', utm_campaign: 'lead_devsolution' }).toString();
    return `https://wa.me/${phone}?text=${text}&${utms}`;
  }, []);

  // Fechar modal com ESC (sem travar o body)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(null); };
    document.addEventListener('keydown', onKey);
    if (mobileOpen) {
      // foca no container do dialog para acessibilidade
      setTimeout(() => dialogRef.current?.focus(), 0);
    }
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const active = OFFERS.find(o => o.id === selected)!;
  const mobileActive = mobileOpen ? OFFERS.find(o => o.id === mobileOpen)! : null;

  const handleCardClick = (id: string) => {
    if (isMobile) {
      // Se já estiver com modal aberto, não abre outro — exige fechar antes.
      if (mobileOpen) return;
      setMobileOpen(id);
    } else {
      setSelected(id);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Título */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary mb-3">O que podemos fazer pela sua empresa</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Soluções sob medida para seu momento — sempre com performance, SEO e mensuração (GA4).
          </p>
        </motion.div>

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

      {/* Modal MOBILE */}
      <AnimatePresence>
        {mobileActive && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end justify-center md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            onClick={() => setMobileOpen(null)} // permite fechar por backdrop; remova se quiser só pelo botão
          >
            <div className="absolute inset-0 bg-black/60" />

            <motion.div
              ref={dialogRef}
              tabIndex={-1}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="relative w-full max-w-md mx-auto bg-white text-primary rounded-t-2xl shadow-xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header do modal com botão Fechar (claro e grande) */}
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold">{mobileActive.title}</h4>
                <button
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 hover:bg-gray-200"
                  onClick={() => setMobileOpen(null)}
                  aria-label="Fechar"
                >
                  <FaTimes />
                  Fechar
                </button>
              </div>
              <p className="text-secondary mb-4">{mobileActive.subtitle}</p>

              <DetailsBlock offer={mobileActive} waHref={waHref} compact />
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
  return (
    <div>
      {!compact && (
        <header className="mb-5">
          <div className="flex items-center gap-3 mb-1">
            {offer.icon}
            <h4 className="text-xl font-bold text-primary">{offer.title}</h4>
          </div>
          <p className="text-secondary">{offer.subtitle}</p>
        </header>
      )}

      <div className={`grid grid-cols-1 ${compact ? 'gap-5' : 'lg:grid-cols-3 gap-8'}`}>
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
