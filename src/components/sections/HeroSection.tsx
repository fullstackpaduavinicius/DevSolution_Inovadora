'use client';
import { motion } from 'framer-motion';
import { FaArrowRight, FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';

export default function HeroSection() {
  const waHref = (() => {
    const phone = '5579998807035';
    const text = encodeURIComponent(
      'Olá! Vim pelo site da DevSolution Inovadora e quero solicitar um orçamento.'
    );
    const utms = new URLSearchParams({
      utm_source: 'site',
      utm_medium: 'hero_cta',
      utm_campaign: 'lead_devsolution',
    }).toString();
    return `https://wa.me/${phone}?text=${text}&${utms}`;
  })();

  return (
    <section className="relative text-light py-24 px-4 overflow-hidden">
      {/* Apenas o vídeo como fundo */}
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
          aria-hidden
          poster="/banner_fallback.jpg"
        >
          <source src="/banner1_video.mp4" type="video/mp4" />
          <Image
            src="/banner_fallback.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </video>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            <span className="block">De ideias a</span>
            <span className="text-accent"> soluções digitais reais</span>
          </h1>

          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto md:mx-0 text-light">
            Sites modernos, e-commerces completos e sistemas sob medida.&nbsp;
            Performance, SEO e automação para aumentar suas vendas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="/services"
              className="bg-accent hover:bg-secondary text-black font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition"
            >
              Nossos Serviços <FaArrowRight />
            </a>
            <a
              href={waHref}
              className="bg-secondary hover:bg-accent text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition"
              data-gtag="click_whatsapp"
            >
              <FaWhatsapp size={20} /> Fale no WhatsApp
            </a>
          </div>
        </motion.div>
      </div>

      {/* Elementos decorativos (mantidos mas sem fundo) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute -right-32 -top-32 w-72 h-72 rounded-full border-4 border-accent/40 opacity-30"
        aria-hidden
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute -left-20 bottom-0 w-96 h-96 rounded-full border-4 border-accent/40 opacity-30"
        aria-hidden
      />
    </section>
  );
}