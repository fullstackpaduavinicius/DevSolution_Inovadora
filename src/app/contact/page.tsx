'use client';

import { useState, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FaPaperPlane, FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
import SectionTitle from '@/components/ui/SectionTitle';

/**
 * ContactPage — versão simplificada
 * Alterações:
 * - Removida a opção de orçamento
 * - Submissão agora envia via form action="mailto:devsolutionsinovadora@gmail.com"
 */

type FormData = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: 'landing' | 'institucional' | 'ecommerce' | 'automacao' | 'saas';
  deadline?: 'urgente' | '2-4 semanas' | '1-3 meses' | '3+ meses';
  wantsGa4?: boolean;
  wantsMaintenance?: boolean;
  message: string;
  website?: string; // honeypot
};

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const alertRef = useRef<HTMLDivElement | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const waHref = useMemo(() => {
    const phone = '5579998807035';
    const text = encodeURIComponent('Olá! Vim pelo site da Dev Solution e quero um orçamento sob medida. Posso te enviar algumas infos agora?');
    const utms = new URLSearchParams({
      utm_source: 'site',
      utm_medium: 'contact_cta',
      utm_campaign: 'lead_devsolution',
    }).toString();
    return `https://wa.me/${phone}?text=${text}&${utms}`;
  }, []);

  return (
    <main className="pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionTitle
          title="Entre em Contato"
          subtitle="Conte sobre seu projeto e receba prazos e entregáveis claros"
          center
        />

        <section className="bg-white rounded-2xl shadow-md p-5 sm:p-6 border border-gray-100">
          <h3 className="text-xl sm:text-2xl font-bold text-primary mb-1">Envie sua mensagem</h3>
          <p className="text-secondary mb-5">Respondemos em até <span className="font-medium">24h úteis</span>.</p>

          {sent && (
            <div
              ref={alertRef}
              tabIndex={-1}
              className="mb-4 flex items-start gap-3 rounded-lg p-3 border border-emerald-200 bg-emerald-50 text-emerald-800"
              role="status"
              aria-live="polite"
            >
              <FaCheckCircle className="mt-0.5" />
              <div>
                <p className="font-semibold">Mensagem enviada!</p>
                <p className="text-sm">Obrigado pelo contato. Em breve retornaremos.</p>
              </div>
            </div>
          )}

          <form
            action="mailto:devsolutionsinovadora@gmail.com"
            method="post"
            encType="text/plain"
            className="space-y-4"
            onSubmit={() => setSent(true)}
          >
            <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} className="hidden" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="name" className="block text-secondary">Nome*</label>
                <input
                  id="name"
                  type="text"
                  {...register('name', { required: 'Informe seu nome' })}
                  className="w-full rounded-lg border px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="company" className="block text-secondary">Empresa (opcional)</label>
                <input id="company" type="text" {...register('company')} className="w-full rounded-lg border px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="email" className="block text-secondary">E-mail*</label>
                <input id="email" type="email" {...register('email', { required: 'Informe um e-mail válido' })} className="w-full rounded-lg border px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent" />
                {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
              </div>
              <div className="space-y-1">
                <label htmlFor="phone" className="block text-secondary">Telefone (opcional)</label>
                <input id="phone" type="tel" {...register('phone')} className="w-full rounded-lg border px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="projectType" className="block text-secondary">Tipo de projeto</label>
                <select id="projectType" {...register('projectType')} className="w-full rounded-lg border px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-accent">
                  <option value="">Selecione…</option>
                  <option value="landing">Landing page</option>
                  <option value="institucional">Site institucional</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="automacao">Automações/Integrações</option>
                  <option value="saas">SaaS / MVP</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="deadline" className="block text-secondary">Prazo</label>
                <select id="deadline" {...register('deadline')} className="w-full rounded-lg border px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-accent">
                  <option value="">Selecione…</option>
                  <option value="urgente">Urgente</option>
                  <option value="2-4 semanas">2–4 semanas</option>
                  <option value="1-3 meses">1–3 meses</option>
                  <option value="3+ meses">3+ meses</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="inline-flex items-start gap-2 cursor-pointer select-none">
                <input type="checkbox" {...register('wantsGa4')} className="mt-1" />
                <span className="text-sm text-secondary">Quero medição com GA4 e relatório básico</span>
              </label>
              <label className="inline-flex items-start gap-2 cursor-pointer select-none">
                <input type="checkbox" {...register('wantsMaintenance')} className="mt-1" />
                <span className="text-sm text-secondary">Quero manutenção/banco de horas pós-projeto</span>
              </label>
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="block text-secondary">Mensagem*</label>
              <textarea id="message" rows={5} {...register('message', { required: 'Escreva uma mensagem' })} className="w-full rounded-lg border px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="Contexto do projeto, objetivos, referências…" />
              {errors.message && <p className="text-red-600 text-sm">{errors.message.message}</p>}
            </div>

            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold bg-accent text-black hover:opacity-90 transition">
              <FaPaperPlane /> Enviar mensagem
            </button>

            <p className="text-xs text-secondary text-center mt-2">Ao enviar, você concorda com o tratamento dos dados para contato comercial (LGPD).</p>
          </form>
        </section>

        <div className="text-center mt-6">
          <a href={waHref} className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-primary text-light hover:opacity-90 transition">
            <FaWhatsapp className="text-base" /> Falar agora no WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
