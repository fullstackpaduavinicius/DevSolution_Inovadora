'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useForm, type FieldError } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaUpload, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import SectionTitle from '@/components/ui/SectionTitle';

type FormData = {
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
};

const MAX_SIZE_MB = 5;

export default function TrabalheConoscoPage() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const [fileError, setFileError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const dropRef = useRef<HTMLLabelElement | null>(null);

  const resumeFile = watch('resume')?.[0];

  const humanFileSize = useMemo(() => {
    if (!resumeFile) return '';
    const sizeMB = resumeFile.size / (1024 * 1024);
    return `${sizeMB.toFixed(2)} MB`;
  }, [resumeFile]);

  const validateAndSetFile = useCallback(
    (file: File | null) => {
      if (!file) return;
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
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

  // Não usamos os dados para envio de verdade agora; só feedback visual
  const onSubmit = () => {
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    reset();
    setFileError(null);
  };

  return (
    <main className="pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionTitle
          title="Trabalhe Conosco"
          subtitle="Junte-se à DevSolution Inovadora para construir produtos que impactam negócios de verdade"
          center
        />

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
              Talento, qualidade e curiosidade por resultados
            </h2>
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
            <Image
              src="/images/careers-hero.jpg"
              alt="Equipe colaborando em projeto digital"
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-md p-5 sm:p-6"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-primary mb-1">Envie seu perfil</h3>
          <p className="text-secondary mb-5">
            Preencha seus dados e anexe seu currículo em PDF. Retornamos em até <strong>5 dias úteis</strong>.
          </p>

          {sent && (
            <div
              className="mb-4 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800"
              role="status"
              aria-live="polite"
            >
              <FaCheckCircle className="mt-0.5" />
              <div>
                <p className="font-semibold">Recebido com sucesso!</p>
                <p className="text-sm">Obrigado! Em breve entraremos em contato.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
                  {...register('phone', {
                    pattern: { value: /^[0-9+()\-.\s]{8,20}$/, message: 'Telefone inválido' },
                  })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="+55 79 9XXXX-XXXX"
                />
                {errors.phone?.message && <p className="text-red-600 text-sm">{errors.phone.message as string}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="role" className="block text-secondary">Área de interesse</label>
                <select
                  id="role"
                  {...register('role')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-accent"
                >
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
                <select
                  id="experience"
                  {...register('experience')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-accent"
                >
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
                <input
                  id="linkedin"
                  type="url"
                  {...register('linkedin')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://www.linkedin.com/in/seu-perfil"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="portfolio" className="block text-secondary">Portfólio/GitHub (opcional)</label>
                <input
                  id="portfolio"
                  type="url"
                  {...register('portfolio')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://github.com/seuuser"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="block text-secondary">Mensagem (opcional)</label>
              <textarea
                id="message"
                rows={4}
                {...register('message')}
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Fale rapidamente sobre sua experiência ou disponibilidade."
              />
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
                <p className="text-sm text-secondary">
                  Arraste seu PDF aqui ou <span className="text-accent font-medium">clique para selecionar</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">Apenas .pdf — tamanho máx. {MAX_SIZE_MB}MB</p>
                <input
                  id="resume"
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  {...register('resume', { required: 'Anexe seu currículo em PDF' })}
                  onChange={(e) => validateAndSetFile(e.target.files?.[0] ?? null)}
                />
              </label>

              {resumeFile && !fileError && (
                <div className="rounded-lg bg-light p-3 text-sm text-primary">
                  <span className="font-medium">Selecionado:</span> {resumeFile.name}{' '}
                  <span className="text-secondary">({humanFileSize})</span>
                </div>
              )}

              {fileError && <p className="text-red-600 text-sm">{fileError}</p>}
              {errors.resume?.message && !fileError && (
                <p className="text-red-600 text-sm">{(errors.resume as FieldError).message}</p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <input
                id="consent"
                type="checkbox"
                {...register('consent', { required: 'Você precisa concordar para enviar' })}
                className="mt-1"
              />
              <label htmlFor="consent" className="text-sm text-secondary">
                Concordo que meus dados sejam tratados para fins de recrutamento (LGPD).
              </label>
            </div>
            {errors.consent?.message && (
              <p className="text-red-600 text-sm">{(errors.consent as FieldError).message}</p>
            )}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold bg-accent text-black hover:opacity-90 transition"
            >
              <FaPaperPlane />
              Enviar candidatura (visual)
            </button>
          </form>
        </motion.section>
      </div>
    </main>
  );
}
