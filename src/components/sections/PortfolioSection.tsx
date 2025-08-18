'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  FaSearch, FaTachometerAlt, FaChartLine, FaRobot,
  FaShoppingCart, FaRocket, FaWhatsapp, FaCheckCircle
} from 'react-icons/fa';

type Topic = {
  id: 'seo' | 'perf' | 'ga4' | 'auto' | 'ecom' | 'mvp';
  icon: ReactNode;
  name: string;
  headline: string;
  intro: string;
  why: string[];
  steps: string[];
  metrics: string[];
  myth: string;
  fact: string;
  checklist: string[];
};

const TOPICS: Topic[] = [
  {
    id: 'seo',
    icon: <FaSearch className="text-accent" />,
    name: 'SEO',
    headline: 'Seja encontrado por quem já está procurando você',
    intro:
      'SEO técnico + conteúdo certo colocam sua página na frente quando o cliente está com a intenção de compra alta.',
    why: [
      'Tráfego orgânico previsível a médio prazo',
      'Custo por lead menor que mídia paga',
      'Autoridade de marca no longo prazo',
    ],
    steps: [
      'Corrigir títulos, meta tags e headings',
      'Dados estruturados e sitemap/robots',
      'Conteúdo que responde dúvidas (intenção!)',
    ],
    metrics: ['Impressões', 'CTR orgânico', 'Posição média', 'Leads orgânicos'],
    myth: '“SEO é só mexer em palavras-chave.”',
    fact: 'SEO é experiência + técnica + conteúdo. Velocidade e UX contam (muito).',
    checklist: ['Title/Description únicos', 'URLs limpas', 'Schema.org', 'Links internos', 'Core Web Vitals OK'],
  },
  {
    id: 'perf',
    icon: <FaTachometerAlt className="text-accent" />,
    name: 'Performance',
    headline: 'Velocidade é conversão',
    intro:
      'Páginas rápidas reduzem rejeição, aumentam o tempo de sessão e melhoram posições no Google.',
    why: ['Mais conversões', 'Melhor SEO', 'Experiência mobile superior'],
    steps: [
      'Imagens otimizadas/modernas (WebP/AVIF)',
      'Code-split e lazy loading',
      'Requisições e scripts mínimos',
    ],
    metrics: ['Lighthouse', 'LCP', 'CLS', 'Tempo até interação'],
    myth: '“Rodou 100 no Lighthouse, acabou.”',
    fact: 'O objetivo é consistência real no tráfego; monitore com usuários de verdade.',
    checklist: ['Imagens responsivas', 'Fontes locais', 'Cache/CDN', 'Minificação', 'Monitoramento contínuo'],
  },
  {
    id: 'ga4',
    icon: <FaChartLine className="text-accent" />,
    name: 'GA4',
    headline: 'Medição confiável para decisões melhores',
    intro:
      'Sem eventos bem definidos, você otimiza no escuro. GA4 conecta comportamento a resultados.',
    why: ['Funil claro', 'Atribuição por campanha', 'ROI visível'],
    steps: [
      'Mapa de eventos (cliques, scroll, envio de lead)',
      'Parâmetros/UTMs consistentes',
      'Relatórios recorrentes',
    ],
    metrics: ['Eventos', 'Conversões', 'CAC', 'LTV', 'ROAS'],
    myth: '“É só instalar e pronto.”',
    fact: 'O valor vem do plano de medição + qualidade dos eventos.',
    checklist: ['UTMs padronizadas', 'Eventos chave', 'Auditorias mensais', 'Relatórios auto-enviados'],
  },
  {
    id: 'auto',
    icon: <FaRobot className="text-accent" />,
    name: 'Automações',
    headline: 'Tempo do time focado no que realmente importa',
    intro:
      'Bots e integrações tiram tarefas repetitivas do caminho e reduzem erros manuais.',
    why: ['Menos custo operacional', 'Menos erro humano', 'Escala com time enxuto'],
    steps: [
      'Mapear processos (BPMN light)',
      'Workers/Webhooks com logs',
      'Alertas e relatórios automáticos',
    ],
    metrics: ['Horas poupadas', 'SLA de tarefas', 'Erros/incidentes'],
    myth: '“Automação é só para empresas grandes.”',
    fact: 'Começa pequeno (POC) e evolui. Ganhos aparecem rápido.',
    checklist: ['Processo mapeado', 'Fallback documentado', 'Alertas configurados', 'Logs auditáveis'],
  },
  {
    id: 'ecom',
    icon: <FaShoppingCart className="text-accent" />,
    name: 'E-commerce',
    headline: 'Loja rápida, funil claro e pagamento sem atrito',
    intro:
      'UX + performance + métricas de funil levantam a taxa de conversão e reduzem custo por venda.',
    why: ['Mais receita', 'Menos abandono', 'Dados para crescer'],
    steps: ['Checkout simples', 'Pix/Cartão integrados', 'Teste A/B de páginas chave'],
    metrics: ['Conversão', 'Ticket médio', 'Abandono de carrinho', 'ROAS'],
    myth: '“É só subir produto.”',
    fact: 'É sobre funil, confiança e velocidade.',
    checklist: ['Fotos boas', 'Prova social', 'Frete claro', 'GA4 por etapa do funil'],
  },
  {
    id: 'mvp',
    icon: <FaRocket className="text-accent" />,
    name: 'MVP',
    headline: 'Valide rápido, aprenda e escale com segurança',
    intro:
      'MVP enxuto com eventos de ativação/retenção para orientar o roadmap antes de investir pesado.',
    why: ['Tempo-to-market curto', 'Aprendizado rápido', 'Menos risco'],
    steps: ['Priorizar hipóteses', 'Protótipo navegável', 'Telemetria desde o dia 1'],
    metrics: ['Ativação', 'Retenção', 'Engajamento', 'NPS'],
    myth: '“MVP precisa estar perfeito.”',
    fact: 'Precisa ser útil e mensurável. O resto evolui.',
    checklist: ['Autenticação segura', 'RBAC básico', 'Observabilidade', 'Deploy automatizado'],
  },
];

export default function EducationSection() {
  const [active, setActive] = useState<Topic['id']>('seo');

  // Mini calculadora — simples e didática
  const [visits, setVisits] = useState(5000);
  const [conv, setConv] = useState(1.5); // %
  const [lift, setLift] = useState(20);  // %
  const prefersReducedMotion = useReducedMotion();

  const topic = useMemo(() => TOPICS.find((t) => t.id === active)!, [active]);

  const baselineLeads = useMemo(() => Math.round((visits * (conv / 100))), [visits, conv]);
  const improvedLeads = useMemo(
    () => Math.round((visits * ((conv * (1 + lift / 100)) / 100))),
    [visits, conv, lift]
  );
  const delta = improvedLeads - baselineLeads;

  const waHref = useMemo(() => {
    const phone = '5579998807035';
    const text = encodeURIComponent('Olá! Quero ajuda para aplicar as boas práticas do guia.');
    const utms = new URLSearchParams({ utm_source: 'site', utm_medium: 'education_section', utm_campaign: 'lead_devsolution' }).toString();
    return `https://wa.me/${phone}?text=${text}&${utms}`;
  }, []);

  return (
    <section className="bg-white py-14">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h2
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-primary"
          >
            Aprenda rápido. Aplique hoje.
          </motion.h2>
          <p className="text-secondary mt-2 max-w-2xl mx-auto">
            Conteúdo prático em pílulas — SEO, performance, GA4, automações e mais. Sem enrolação.
          </p>
        </div>

        {/* Nav de tópicos (scrollable no mobile, sem fundo preenchido no ativo) */}
        <div className="mb-6">
          <div
            className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory touch-pan-x"
            role="tablist"
            aria-label="Conteúdos educativos"
          >
            {TOPICS.map((t) => {
              const activeTab = t.id === active;
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  role="tab"
                  aria-selected={activeTab}
                  aria-controls={`panel-${t.id}`}
                  className={[
                    'snap-start shrink-0 inline-flex items-center gap-2',
                    'min-h-11 px-3 py-2 rounded-xl text-sm border transition-all',
                    // ativo: apenas borda e destaque sutil (sem preencher o fundo)
                    activeTab
                      ? 'bg-white text-primary border-accent ring-2 ring-accent/40'
                      : 'bg-white text-primary border-gray-200 hover:border-accent hover:ring-1 hover:ring-accent/30'
                  ].join(' ')}
                >
                  <span className="text-base">{t.icon}</span>
                  <span className="font-medium">{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Painel do tópico */}
        <motion.div
          key={topic.id}
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          role="tabpanel"
          id={`panel-${topic.id}`}
          aria-labelledby={topic.id}
        >
          {/* Bloco principal */}
          <div className="lg:col-span-2 bg-light rounded-2xl p-5 shadow-sm">
            <h3 className="text-xl font-bold text-primary mb-1">{topic.headline}</h3>
            <p className="text-secondary mb-4">{topic.intro}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Por que importa</h4>
                <ul className="space-y-2">
                  {topic.why.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <FaCheckCircle className="mt-0.5 mr-2 text-accent" />
                      <span className="text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Como aplicar</h4>
                <ol className="space-y-2 list-decimal list-inside">
                  {topic.steps.map((step, i) => (
                    <li key={i} className="text-secondary">{step}</li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Métricas que importam</h4>
                <div className="flex flex-wrap gap-2">
                  {topic.metrics.map((m, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-white text-primary text-xs shadow-sm">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border p-3 bg-white">
                <p className="text-[13px] font-semibold text-primary">Mito vs. Fato</p>
                <p className="text-secondary mt-1">
                  <span className="font-semibold text-primary">Mito:</span> {topic.myth}
                </p>
                <p className="text-secondary mt-1">
                  <span className="font-semibold text-primary">Fato:</span> {topic.fact}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <h4 className="font-semibold mb-2">Checklist rápido</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {topic.checklist.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm">
                    <FaCheckCircle className="text-accent" />
                    <span className="text-sm text-secondary">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calculadora + CTA */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border p-5 bg-white shadow-sm">
              <h4 className="font-semibold text-primary mb-1">Calculadora de impacto</h4>
              <p className="text-secondary text-sm mb-3">
                Estime leads extras ao melhorar conversão (ex.: com performance/UX/SEO).
              </p>

              <label className="block text-sm mb-1">Visitas/mês</label>
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                min={0}
                className="w-full rounded-lg border px-3 py-2 mb-3"
                value={visits}
                onChange={(e) => setVisits(Math.max(0, Number(e.target.value || 0)))}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Taxa atual (%)</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    min={0}
                    className="w-full rounded-lg border px-3 py-2"
                    value={conv}
                    onChange={(e) => setConv(Math.max(0, Number(e.target.value || 0)))}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Melhoria (%)</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    step="1"
                    min={0}
                    className="w-full rounded-lg border px-3 py-2"
                    value={lift}
                    onChange={(e) => setLift(Math.max(0, Number(e.target.value || 0)))}
                  />
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-light p-3">
                <p className="text-sm text-secondary">
                  Leads/mês (atual): <span className="font-semibold text-primary">{baselineLeads}</span>
                </p>
                <p className="text-sm text-secondary">
                  Leads/mês (estimado): <span className="font-semibold text-primary">{improvedLeads}</span>
                </p>
                <p className="text-sm text-primary font-semibold mt-1">
                  Ganho estimado: {delta >= 0 ? '+' : ''}{delta} leads/mês
                </p>
              </div>
            </div>

            <a
              href={waHref}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-accent text-black hover:opacity-90 transition"
            >
              <FaWhatsapp className="text-base" />
              Quero aplicar isso no meu projeto
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
