'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FaPaperPlane, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaEnvelope,
  FaLinkedin, FaGithub, FaInstagram, FaCheckCircle
} from 'react-icons/fa';
import SectionTitle from '@/components/ui/SectionTitle';

type FormData = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  website?: string; // honeypot
};

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>();

  const waHref = useMemo(() => {
    const phone = '5579998807035';
    const text = encodeURIComponent('Olá! Vim pelo site da DevSolution Inovadora e quero solicitar um orçamento.');
    const utms = new URLSearchParams({
      utm_source: 'site',
      utm_medium: 'contact_cta',
      utm_campaign: 'lead_devsolution',
    }).toString();
    return `https://wa.me/${phone}?text=${text}&${utms}`;
  }, []);

  const onSubmit = async (data: FormData) => {
    if (data.website && data.website.trim() !== '') return; // honeypot
    setSubmitting(true);
    setSent(false);

    try {
      const payload = {
        ...data,
        submittedAt: new Date().toISOString(),
        source: 'contact_page',
      };

      const endpoint = 'https://api.sheetmonkey.io/form/YOUR_FORM_ID_HERE';
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) throw new Error('Erro ao enviar');

      setSent(true);
      reset();
    } catch (e) {
      alert('Ocorreu um erro ao enviar. Tente novamente em instantes.');
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionTitle
          title="Entre em Contato"
          subtitle="Conte sobre seu projeto e receba prazos e entregáveis claros"
          center
        />

        {/* GRID PRINCIPAL: FORM + CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORMULÁRIO */}
          <section className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold text-primary mb-1">Envie sua mensagem</h3>
              <p className="text-secondary mb-5">Respondemos em até <span className="font-medium">24h úteis</span>.</p>

              {sent && (
                <div className="mb-4 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
                  <FaCheckCircle className="mt-0.5" />
                  <div>
                    <p className="font-semibold">Mensagem enviada!</p>
                    <p className="text-sm">Obrigado pelo contato. Em breve retornaremos.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} className="hidden" />

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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-secondary">E-mail*</label>
                    <input
                      id="email"
                      type="email"
                      {...register('email', { required: 'Informe um e-mail válido' })}
                      className="w-full rounded-lg border px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="phone" className="block text-secondary">Telefone (opcional)</label>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className="w-full rounded-lg border px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="message" className="block text-secondary">Mensagem*</label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register('message', { required: 'Escreva uma mensagem' })}
                    className="w-full rounded-lg border px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  {errors.message && <p className="text-red-600 text-sm">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold bg-accent text-black hover:opacity-90 transition disabled:opacity-60"
                >
                  <FaPaperPlane />
                  {submitting ? 'Enviando…' : 'Enviar mensagem'}
                </button>
              </form>
            </div>
          </section>

          {/* CARDS NA LATERAL */}
          <aside className="space-y-6">
            {/* Telefone */}
            <div className="flex items-start gap-4 bg-white shadow-md rounded-xl p-6 border">
              <FaPhone size={22} className="text-accent mt-1" />
              <div>
                <h4 className="font-bold text-primary">Telefone</h4>
                <p className="text-secondary">+55 (79) 99880-7035</p>
                <p className="text-sm text-gray-500">Seg a Sex, 9h–18h</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 bg-white shadow-md rounded-xl p-6 border">
              <FaEnvelope size={22} className="text-accent mt-1" />
              <div>
                <h4 className="font-bold text-primary">E-mail</h4>
                <p className="text-secondary break-words">fullstackpaduavinicius@gmail.com</p>
                <p className="text-sm text-gray-500">Resposta em até 24h úteis</p>
              </div>
            </div>

            {/* Local */}
            <div className="flex items-start gap-4 bg-white shadow-md rounded-xl p-6 border">
              <FaMapMarkerAlt size={22} className="text-accent mt-1" />
              <div>
                <h4 className="font-bold text-primary">Local</h4>
                <p className="text-secondary">Aracaju-SE</p>
                <p className="text-sm text-gray-500">Atendimento nacional</p>
              </div>
            </div>

            {/* Redes */}
            <div className="flex flex-col gap-4 bg-white shadow-md rounded-xl p-6 border">
              <h4 className="font-bold text-primary">Redes</h4>
              <div className="flex gap-6 text-2xl text-primary">
                <a href={waHref} className="hover:text-accent"><FaWhatsapp /></a>
                <a href="https://www.linkedin.com/in/ivan-vin%C3%ADcius-832821330/" className="hover:text-accent"><FaLinkedin /></a>
                <a href="https://github.com/fullstackpaduavinicius" className="hover:text-accent"><FaGithub /></a>
                <a href="https://www.instagram.com/paduaviniciusdev?igsh=bWltaHF6aWxkendo" className="hover:text-accent"><FaInstagram /></a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
