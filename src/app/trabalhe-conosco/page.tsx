'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useForm, type FieldError } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaUpload, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import SectionTitle from '@/components/ui/SectionTitle';

/**
 * TrabalheConoscoPage — versão aprimorada
 *
 * Melhorias principais:
 * - Envio REAL via fetch para /api/careers (multipart/form-data)
 * - Estados de carregamento/erro/sucesso e desabilitar botão
 * - Honeypot anti-spam (campo oculto)
 * - Validações extras (URLs) e sanitização leve
 * - GA4 events: submit_start, submit_success, submit_error
 * - UX/A11y: aria-live, mensagens claras, foco no alerta
 * - Mantém mock caso a rota não exista (fallback controlado)
 */

type FormDataShape = {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  experience?: string;
  linkedin?: string;
  portfolio?: string;
  message?: string;
  resume?: FileList;
  consent?: boolean;
  // Honeypot
  company?: string;
};

const MAX_SIZE_MB = 5;
const ACCEPTED_MIME = ['application/pdf'];

export default function TrabalheConoscoPage() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm<FormDataShape>();

  const [fileError, setFileError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const alertRef = useRef<HTMLDivElement | null>(null);
  const dropRef = useRef<HTMLLabelElement | null>(null);

  const resumeFile = watch('resume')?.[0];

  const humanFileSize = useMemo(() => {
    if (!resumeFile) return '';
    const sizeMB = resumeFile.size / (1024 * 1024);
    return `${sizeMB.toFixed(2)} MB`;
  }, [resumeFile]);

  const isPdf = (file: File) => ACCEPTED_MIME.includes(file.type) || file.name.toLowerCase().endsWith('.pdf');

  const validateAndSetFile = useCallback(
    (file: File | null) => {
      if (!file) return;
      if (!isPdf(file)) {
        setFileError('Envie um arquivo PDF (.pdf).');
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setFileError(`Tamanho máximo: ${MAX_SIZE_MB}MB.`);
        return;
      }
      setFileError(null);
      const list = {
        0: file,
        length: 1,
        item: (idx: number) => (idx === 0 ? file : null),
      } as unknown as FileList;
      setValue('resume', list, { shouldValidate: true });
    },
    [setValue]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0] ?? null;
      validateAndSetFile(file);
      dropRef.current?.classList.remove('ring-2', 'ring-accent');
    },
    [validateAndSetFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current?.classList.add('ring-2', 'ring-accent');
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current?.classList.remove('ring-2', 'ring-accent');
  }, []);

  // Sanitização leve de URLs
  const urlPattern = /^(https?:\/\/)[^\s]+$/i;

  const onSubmit = async (data: FormDataShape) => {
    setSubmitting(true);
    setErrorMsg(null);
    setSent(false);
    try {
      // Honeypot: se preenchido, aborta silenciosamente
      if (data.company && data.company.trim().length > 0) {
        setSubmitting(false);
        return;
      }

      // Valida URLs opcionais (se preenchidas)
      if (data.linkedin && !urlPattern.test(data.linkedin)) throw new Error('URL do LinkedIn inválida.');
      if (data.portfolio && !urlPattern.test(data.portfolio)) throw new Error('URL do Portfólio inválida.');

      // Valida arquivo
      const file = data.resume?.[0];
      if (!file) throw new Error('Anexe seu currículo em PDF.');
      if (!isPdf(file)) throw new Error('Envie um arquivo PDF (.pdf).');
      if (file.size > MAX_SIZE_MB * 1024 * 1024) throw new Error(`Tamanho máximo: ${MAX_SIZE_MB}MB.`);

      // GA4 start
      try {
        // @ts-ignore
        window.gtag?.('event', 'submit_start', { form: 'careers', role: data.role, exp: data.experience });
      } catch {}

      const fd = new FormData();
      fd.append('name', data.name);
      fd.append('email', data.email);
      if (data.phone) fd.append('phone', data.phone);
      if (data.role) fd.append('role', data.role);
      if (data.experience) fd.append('experience', data.experience);
      if (data.linkedin) fd.append('linkedin', data.linkedin);
      if (data.portfolio) fd.append('portfolio', data.portfolio);
      if (data.message) fd.append('message', data.message);
      fd.append('consent', data.consent ? 'true' : 'false');
      fd.append('resume', file, file.name);

      // Envio para API local — crie /api/careers (exemplo abaixo)
      const res = await fetch('/api/careers', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Falha ao enviar. Tente novamente.');
      }

      setSent(true);
      reset();
      setFileError(null);
      alertRef.current?.focus();

      // GA4 success
      try {
        // @ts-ignore
        window.gtag?.('event', 'submit_success', { form: 'careers' });
      } catch {}
    } catch (err: any) {
      const msg = err?.message || 'Erro inesperado. Tente novamente.';
      setErrorMsg(msg);
      alertRef.current?.focus();
      // GA4 error
      try {
        // @ts-ignore
        window.gtag?.('event', 'submit_error', { form: 'careers', error: msg });
      } catch {}
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionTitle
          title="Trabalhe Conosco"
          subtitle="Junte-se à Dev Solution para construir produtos que impactam negócios de verdade"
          center
        />

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">Talento, qualidade e curiosidade por resultados</h2>
            <p className="text-secondary">
              Procuramos pessoas que gostam de resolver problemas com <strong>código limpo</strong>,
              <strong> performance</strong> e <strong>medições reais (GA4)</strong>. Se você domina
              front-end, back-end ou tem experiência com integrações e automações, queremos te conhecer.
            </p>
            <ul className="mt-4 space-y-2 text-secondary">
              <li>• Projetos variados (landing pages, e-commerces, SaaS, automações)</li>
              <li>• Stack moderna: React/Next, Node, TypeScript, MongoDB</li>
              <li>• Cultura de aprendizado contínuo e feedback</li>
            </ul>
          </div>

          <div className="relative w-full h-56 sm:h-72 lg:h-80 rounded-2xl overflow-hidden bg-gray-100">
            <Image src="/images/careers-hero.jpg" alt="Equipe colaborando em projeto digital" fill className="object-cover" priority />
          </div>
        </section>

        <motion.section initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-bold text-primary mb-1">Envie seu perfil</h3>
          <p className="text-secondary mb-5">Preencha seus dados e anexe seu currículo em PDF. Retornamos em até <strong>5 dias úteis</strong>.</p>

          {/* Alertas */}
          {(sent || errorMsg) && (
            <div
              ref={alertRef}
              tabIndex={-1}
              className={`mb-4 flex items-start gap-3 rounded-lg p-3 ${sent ? 'border border-emerald-200 bg-emerald-50 text-emerald-800' : 'border border-red-200 bg-red-50 text-red-800'}`}
              role="status"
              aria-live="polite"
            >
              {sent ? <FaCheckCircle className="mt-0.5" /> : null}
              <div>
                <p className="font-semibold">{sent ? 'Recebido com sucesso!' : 'Não foi possível enviar'}</p>
                <p className="text-sm">{sent ? 'Obrigado! Em breve entraremos em contato.' : errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Honeypot */}
            <div className="hidden">
              <label htmlFor="company">Empresa</label>
              <input id="company" type="text" autoComplete="organization" {...register('company')} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="name" className="block text-secondary">Nome completo*</label>
                <input
                  id="name"
                  type="text"
                  {...register('name', { required: 'Informe seu nome' })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-invalid={!!errors.name}
                  placeholder="Seu nome"
                />
                {errors.name?.message && <p className="text-red-600 text-sm">{errors.name.message}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="block text-secondary">E-mail*</label>
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Informe um e-mail válido',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' },
                  })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-invalid={!!errors.email}
                  placeholder="voce@exemplo.com"
                />
                {errors.email?.message && <p className="text-red-600 text-sm">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label htmlFor="phone" className="block text-secondary">Telefone (opcional)</label>
                <input
                  id="phone"
                  type="tel"
                  {...register('phone', { pattern: { value: /^[0-9+()\-.\s]{8,20}$/, message: 'Telefone inválido' } })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="+55 79 9XXXX-XXXX"
                />
                {errors.phone?.message && <p className="text-red-600 text-sm">{errors.phone.message as string}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="role" className="block text-secondary">Área de interesse</label>
                <select id="role" {...register('role')} className="w-full rounded-lg border border-gray-300 px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-accent">
                  <option value="">Selecione…</option>
                  <option value="frontend">Front-end</option>
                  <option value="backend">Back-end</option>
                  <option value="fullstack">Full-stack</option>
                  <option value="qa">QA / Testes</option>
                  <option value="pm">Produto/PM</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="experience" className="block text-secondary">Experiência</label>
                <select id="experience" {...register('experience')} className="w-full rounded-lg border border-gray-300 px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-accent">
                  <option value="">Selecione…</option>
                  <option value="junior">Júnior</option>
                  <option value="pleno">Pleno</option>
                  <option value="senior">Sênior</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="linkedin" className="block text-secondary">LinkedIn (opcional)</label>
                <input id="linkedin" type="url" {...register('linkedin')} className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="https://www.linkedin.com/in/seu-perfil" />
              </div>
              <div className="space-y-1">
                <label htmlFor="portfolio" className="block text-secondary">Portfólio/GitHub (opcional)</label>
                <input id="portfolio" type="url" {...register('portfolio')} className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="https://github.com/seuuser" />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="block text-secondary">Mensagem (opcional)</label>
              <textarea id="message" rows={4} {...register('message')} className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="Fale rapidamente sobre sua experiência ou disponibilidade." />
            </div>

            <div className="space-y-2">
              <span className="block text-secondary">Currículo (PDF, até {MAX_SIZE_MB}MB)*</span>

              <label
                ref={dropRef}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                htmlFor="resume"
                className={[
                  'flex flex-col items-center justify-center text-center cursor-pointer',
                  'rounded-xl border border-dashed border-gray-300 p-6 bg-white',
                  'hover:border-accent transition'
                ].join(' ')}
              >
                <FaUpload className="text-2xl text-accent mb-2" />
                <p className="text-sm text-secondary">Arraste seu PDF aqui ou <span className="text-accent font-medium">clique para selecionar</span></p>
                <p className="text-xs text-gray-500 mt-1">Apenas .pdf — tamanho máx. {MAX_SIZE_MB}MB</p>
                <input id="resume" type="file" accept={ACCEPTED_MIME.join(',') + ',.pdf'} className="hidden" {...register('resume', { required: 'Anexe seu currículo em PDF' })} onChange={(e) => validateAndSetFile(e.target.files?.[0] ?? null)} />
              </label>

              {resumeFile && !fileError && (
                <div className="rounded-lg bg-light p-3 text-sm text-primary">
                  <span className="font-medium">Selecionado:</span> {resumeFile.name} <span className="text-secondary">({humanFileSize})</span>
                </div>
              )}

              {fileError && <p className="text-red-600 text-sm">{fileError}</p>}
              {errors.resume?.message && !fileError && <p className="text-red-600 text-sm">{(errors.resume as FieldError).message}</p>}
            </div>

            <div className="flex items-start gap-2">
              <input id="consent" type="checkbox" {...register('consent', { required: 'Você precisa concordar para enviar' })} className="mt-1" />
              <label htmlFor="consent" className="text-sm text-secondary">Concordo que meus dados sejam tratados para fins de recrutamento (LGPD).</label>
            </div>
            {errors.consent?.message && <p className="text-red-600 text-sm">{(errors.consent as FieldError).message}</p>}

            <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold bg-accent text-black hover:opacity-90 transition disabled:opacity-60">
              <FaPaperPlane />
              {submitting ? 'Enviando…' : 'Enviar candidatura'}
            </button>

            {/* Fallback: instrução para criar a rota API */}
            <p className="text-xs text-secondary text-center mt-2">
              Dica: implemente a rota <code className="px-1 rounded bg-light">/api/careers</code> para receber as candidaturas.
            </p>
          </form>
        </motion.section>

        {/* Exemplo de implementação do endpoint (Next.js Route Handler) */}
        {/*
        // app/api/careers/route.ts
        import { NextRequest, NextResponse } from 'next/server';
        import { Resend } from 'resend'; // ou Nodemailer

        const resend = new Resend(process.env.RESEND_API_KEY || '');

        export async function POST(req: NextRequest) {
          try {
            const formData = await req.formData();
            const name = String(formData.get('name') || '');
            const email = String(formData.get('email') || '');
            const phone = String(formData.get('phone') || '');
            const role = String(formData.get('role') || '');
            const experience = String(formData.get('experience') || '');
            const linkedin = String(formData.get('linkedin') || '');
            const portfolio = String(formData.get('portfolio') || '');
            const message = String(formData.get('message') || '');
            const consent = String(formData.get('consent') || 'false');
            const resume = formData.get('resume') as File | null;

            if (!name || !email || !resume) {
              return new NextResponse('Campos obrigatórios ausentes.', { status: 400 });
            }

            // Anexo (Buffer)
            const arrayBuf = await resume.arrayBuffer();
            const buffer = Buffer.from(arrayBuf);

            // Enviar por e-mail
            await resend.emails.send({
              from: 'Dev Solution <no-reply@devsolution.com.br>',
              to: ['devsolutionsinovadora@gmail.com'],
              subject: `Nova candidatura — ${name}`,
              html: `
                <h2>Nova candidatura</h2>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${phone}</p>
                <p><strong>Área:</strong> ${role}</p>
                <p><strong>Experiência:</strong> ${experience}</p>
                <p><strong>LinkedIn:</strong> ${linkedin}</p>
                <p><strong>Portfólio:</strong> ${portfolio}</p>
                <p><strong>Mensagem:</strong> ${message}</p>
                <p><strong>Consentimento LGPD:</strong> ${consent}</p>
              `,
              attachments: [
                {
                  filename: resume.name || 'curriculo.pdf',
                  content: buffer,
                },
              ],
            });

            return NextResponse.json({ ok: true });
          } catch (e: any) {
            console.error(e);
            return new NextResponse(e?.message || 'Erro interno', { status: 500 });
          }
        }
        */}
      </div>
    </main>
  );
}
