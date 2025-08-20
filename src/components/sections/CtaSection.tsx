'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaWhatsapp, FaDownload, FaShieldAlt, FaPaperPlane } from 'react-icons/fa';

/** Caminho do PDF (coloque o arquivo em /public/dicasGA4.pdf) */
const PDF_PATH = '/dicasGA4.pdf';
/** E-mail para onde o FormSubmit enviará os leads */
const FORMSUBMIT_EMAIL = 'devsolutionsinovadora@gmail.com';

type Interest = 'SEO' | 'Performance' | 'GA4' | 'Automações' | 'E-commerce' | 'MVP';
const INTERESTS: Interest[] = ['SEO', 'Performance', 'GA4', 'Automações', 'E-commerce', 'MVP'];

export default function LeadMagnetSection() {
  const prefersReducedMotion = useReducedMotion();

  // form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessType, setBusinessType] = useState('Negócio local');
  const [site, setSite] = useState('');
  const [visits, setVisits] = useState<number | ''>(5000);
  const [conv, setConv] = useState<number | ''>(1.5); // %
  const [interests, setInterests] = useState<Interest[]>(['SEO', 'Performance', 'GA4']);
  const [consent, setConsent] = useState(false);
  const [hpField, setHpField] = useState(''); // honeypot anti-spam

  // nova pergunta
  const [wantsNewSite, setWantsNewSite] = useState<'Sim' | 'Não'>('Não');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const waHref = useMemo(() => {
    const phone = '5579998807035';
    const text = encodeURIComponent('Olá! Baixei o guia de boas práticas e quero uma avaliação do meu site.');
    const utms = new URLSearchParams({
      utm_source: 'site',
      utm_medium: 'lead_magnet',
      utm_campaign: 'guia_boas_praticas',
    }).toString();
    return `https://wa.me/${phone}?text=${text}&${utms}`;
  }, []);

  // cálculo simples
  const v = typeof visits === 'number' ? visits : 0;
  const c = typeof conv === 'number' ? conv : 0;
  const baselineLeads = Math.max(0, Math.round(v * (c / 100)));
  const improvedLeads = Math.max(0, Math.round(v * ((c * 1.2) / 100))); // supõe +20% com boas práticas
  const delta = Math.max(0, improvedLeads - baselineLeads);

  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), [email]);
  const nameValid = useMemo(() => name.trim().length >= 2, [name]);
  const consentValid = consent === true;
  const canSubmit = nameValid && emailValid && consentValid && !submitting;

  const toggleInterest = (i: Interest) => {
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  };

  // helper: download imediato
  function triggerDownloadPdf() {
    const link = document.createElement('a');
    link.href = PDF_PATH;
    link.download = 'dicasGA4.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  // envio do lead por e-mail (via FormSubmit – sem backend)
  async function sendLeadViaEmail(data: Record<string, any>) {
    const endpoint = `https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        ...data,
        _subject: 'Novo lead – Guia de Boas Práticas',
        _template: 'table', // exibe organizado
        _captcha: 'false',
        _replyto: data.email,
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Falha ao enviar: ${txt}`);
    }
    return res.json();
  }

  // submit
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (hpField.trim() !== '') return; // honeypot

    try {
      setSubmitting(true);

      // Evento GA4 (opcional)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'lead_magnet_submit', {
          event_category: 'Lead',
          event_label: 'Guia Boas Práticas',
          interests: interests.join(','),
        });
      }

      // 1) muda UI para sucesso
      setSubmitted(true);

      // 2) download imediato
      triggerDownloadPdf();

      // 3) envia e-mail em paralelo (não bloqueia o download)
      sendLeadViaEmail({
        name,
        email,
        businessType,
        site,
        wants_new_site: wantsNewSite, // 🔹 nova pergunta
        interests: interests.join(', '),
        visits: v,
        conversion: c,
        leads_atual: baselineLeads,
        leads_estimado: improvedLeads,
        ganho: `+${delta}`,
        consent: consent ? 'sim' : 'não',
        origem: typeof window !== 'undefined' ? window.location.href : '',
      }).catch((err) => {
        console.error('Erro ao enviar e-mail do lead:', err);
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="guia-gratuito" className="bg-white py-14 scroll-mt-24" aria-labelledby="guia-gratuito-heading">
      <div className="max-w-6xl mx-auto px-4">
        {/* header */}
        <div className="text-center mb-8">
          <motion.h2
            id="guia-gratuito-heading"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-primary"
          >
            Baixe o Guia Gratuito de Boas Práticas
          </motion.h2>
          <p className="text-secondary mt-2 max-w-2xl mx-auto">
            Um PDF direto ao ponto sobre SEO, Performance, GA4, Automações, E-commerce e MVP — para aplicar hoje.
          </p>
        </div>

        {/* grid */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
        >
          {/* lado esquerdo: pitch + destaques + calculadora pequena */}
          <div className="bg-light rounded-2xl p-5 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Feature title="Checklist prático" desc="Itens acionáveis para melhorar em poucas horas." />
              <Feature title="Exemplos e métricas" desc="O que medir e como interpretar (GA4 incluído)." />
              <Feature title="Aplicação real" desc="Casos de uso: local, e-commerce, serviços e MVP." />
              <Feature title="Sem enrolação" desc="Direto ao ponto: foco em resultado e clareza." />
            </div>

            {/* mini calculadora */}
            <div className="mt-5 rounded-xl border bg-white p-4">
              <p className="text-sm font-semibold text-primary">Estime seu ganho de leads</p>
              <p className="text-xs text-secondary mb-3">
                Considerando melhoria de <span className="font-semibold text-primary">+20%</span> com boas práticas.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Visitas/mês</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    className="w-full rounded-lg border px-3 py-2"
                    value={visits}
                    onChange={(e) => setVisits(Math.max(0, Number(e.target.value || 0)))}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Conversão (%)</label>
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
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <DataPill label="Leads (atual)" value={baselineLeads} />
                <DataPill label="Leads (estimado)" value={improvedLeads} />
                <DataPill label="Ganho" value={`+${delta}`} />
              </div>

              <div className="mt-4 flex items-center gap-2 text-secondary text-xs">
                <FaShieldAlt />
                Dados enviados com consentimento. Você pode sair quando quiser.
              </div>
            </div>
          </div>

          {/* lado direito: formulário */}
          {!submitted ? (
            <form onSubmit={onSubmit} noValidate className="bg-white rounded-2xl p-5 shadow-sm border">
              <p className="text-primary font-semibold mb-1">Receba o PDF agora</p>
              <p className="text-secondary text-sm mb-4">
                Enviaremos o link de download e dicas extras com base nos seus interesses.
              </p>

              {/* honeypot invisível */}
              <input
                type="text"
                value={hpField}
                onChange={(e) => setHpField(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-sm mb-1">Nome*</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-3 py-2"
                    placeholder="Como devemos te chamar?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    aria-invalid={!nameValid}
                  />
                  {!nameValid && <p className="text-[12px] text-red-600 mt-1">Informe um nome válido.</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm mb-1">E-mail*</label>
                  <input
                    type="email"
                    className="w-full rounded-lg border px-3 py-2"
                    placeholder="voce@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-invalid={!emailValid}
                  />
                  {!emailValid && <p className="text-[12px] text-red-600 mt-1">Digite um e-mail válido.</p>}
                </div>

                <div>
                  <label className="block text-sm mb-1">Tipo de negócio</label>
                  <select
                    className="w-full rounded-lg border px-3 py-2"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                  >
                    <option>Negócio local</option>
                    <option>E-commerce</option>
                    <option>Serviços/Consultoria</option>
                    <option>Startup/MVP</option>
                    <option>Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Site (opcional)</label>
                  <input
                    type="url"
                    className="w-full rounded-lg border px-3 py-2"
                    placeholder="https://seudominio.com"
                    value={site}
                    onChange={(e) => setSite(e.target.value)}
                  />
                </div>
              </div>

              {/* nova pergunta */}
              <div className="mt-3">
                <label className="block text-sm mb-1">Ainda não tem um site? Deseja criar um?</label>
                <select
                  className="w-full rounded-lg border px-3 py-2"
                  value={wantsNewSite}
                  onChange={(e) => setWantsNewSite(e.target.value as 'Sim' | 'Não')}
                >
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </div>

              <div className="mt-3">
                <p className="text-sm font-medium text-primary mb-1">Interesses (personaliza o conteúdo)</p>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((i) => {
                    const active = interests.includes(i);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleInterest(i)}
                        className={[
                          'px-3 py-1.5 rounded-full border text-sm transition',
                          active
                            ? 'border-accent ring-2 ring-accent/40 bg-white text-primary'
                            : 'border-gray-200 hover:border-accent bg-white text-primary',
                        ].join(' ')}
                        aria-pressed={active}
                      >
                        {i}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* consentimento LGPD */}
              <label className="mt-4 flex items-start gap-2 text-sm text-secondary">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                />
                <span>
                  Concordo em receber o PDF e comunicações relacionadas. Podemos enviar dicas e conteúdos — você pode
                  sair a qualquer momento.
                </span>
              </label>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <motion.button
                  type="submit"
                  whileHover={{ scale: canSubmit ? 1.02 : 1 }}
                  whileTap={{ scale: canSubmit ? 0.98 : 1 }}
                  disabled={!canSubmit}
                  className={[
                    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition',
                    canSubmit ? 'bg-accent text-black hover:opacity-90' : 'bg-gray-200 text-gray-500 cursor-not-allowed',
                  ].join(' ')}
                >
                  <FaPaperPlane />
                  Receber o PDF
                </motion.button>

                <a
                  href={waHref}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-primary text-light hover:opacity-90 transition"
                  data-gtag="click_whatsapp"
                >
                  <FaWhatsapp className="text-base" />
                  Quero ajuda agora
                </a>
              </div>

              <p className="text-[12px] text-secondary mt-3">
                *Prometemos não fazer spam. Somente conteúdo útil e oportunidades reais.
              </p>
            </form>
          ) : (
            // sucesso
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-xl font-bold text-primary">Tudo certo! 🎉</h3>
              <p className="text-secondary mt-1">
                Obrigado, {name.split(' ')[0] || 'por aqui'} — seu guia foi enviado e o download começou.
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <DataPill label="Leads (atual)" value={baselineLeads} />
                <DataPill label="Leads (estimado)" value={improvedLeads} />
                <DataPill label="Ganho" value={`+${delta}`} />
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <a
                  href={PDF_PATH}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-accent text-black hover:opacity-90 transition"
                  download
                >
                  <FaDownload />
                  Baixar PDF novamente
                </a>

                <a
                  href={waHref}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-primary text-light hover:opacity-90 transition"
                >
                  <FaWhatsapp className="text-base" />
                  Quero uma avaliação do meu site
                </a>
              </div>

              {!!interests.length && (
                <div className="mt-5">
                  <p className="text-sm text-secondary">
                    Foco escolhido:{' '}
                    <span className="font-medium text-primary">{interests.join(', ')}</span>. Em breve enviaremos dicas
                    específicas.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- componentes auxiliares ---------- */

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-sm border">
      <p className="text-sm font-semibold text-primary">{title}</p>
      <p className="text-sm text-secondary mt-0.5">{desc}</p>
    </div>
  );
}

function DataPill({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-light p-3">
      <p className="text-[12px] text-secondary">{label}</p>
      <p className="text-lg font-bold text-primary">{value}</p>
    </div>
  );
}
