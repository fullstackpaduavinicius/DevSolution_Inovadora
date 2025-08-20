'use client';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const year = new Date().getFullYear();

  const waHref = (() => {
    const phone = '5579998807035'; // seu número
    const text = encodeURIComponent('Olá! Vim pelo site da DevSolution Inovadora e quero solicitar um orçamento.');
    const utms = new URLSearchParams({
      utm_source: 'site',
      utm_medium: 'footer_cta',
      utm_campaign: 'lead_devsolution'
    }).toString();
    return `https://wa.me/${phone}?text=${text}&${utms}`;
  })();

  return (
    <footer className="bg-secondary text-light">
      {/* Top */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Marca */}
          <div>
            <h3 className="text-xl font-bold mb-3">
              DevSolution <span className="text-accent">Inovadora</span>
            </h3>
            <p className="text-sm/6 text-light/80">
              Desenvolvimento web, automações e software sob medida com foco em performance, SEO e mensuração via GA4.
            </p>
            <p className="mt-4 text-sm text-light/70">
              📍 Aracaju-SE • Atendemos em todo o Brasil
            </p>
            <a
              href={waHref}
              className="mt-5 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-accent text-black hover:opacity-90 transition"
              aria-label="Falar no WhatsApp"
              data-gtag="click_whatsapp"
            >
              <FaWhatsapp className="text-base" />
              Falar no WhatsApp
            </a>
          </div>

          {/* Links rápidos */}
          <nav aria-label="Links rápidos">
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-accent">Home</Link></li>
              <li><Link href="/sobre" className="hover:text-accent">Sobre</Link></li>
              <li><Link href="/servicos" className="hover:text-accent">Serviços</Link></li>
              <li><Link href="/credibilidade" className="hover:text-accent">Credibilidade</Link></li>
              <li><Link href="/contato" className="hover:text-accent">Contato</Link></li>
            </ul>
          </nav>

          {/* Soluções */}
         <nav aria-label="Soluções">
            <h4 className="text-lg font-semibold mb-4">Soluções</h4>
            <ul className="space-y-2">
              <li><Link href="/servicos/sites-e-aplicacoes" className="hover:text-accent">Sites & Aplicações</Link></li>
              <li><Link href="/servicos/sistemas-saas" className="hover:text-accent">Sistemas & SaaS</Link></li>
              <li><Link href="/servicos/apps-ux" className="hover:text-accent">Dashboards, SPA & PWA</Link></li>
              <li><Link href="/servicos/seguranca-auth" className="hover:text-accent">Segurança & Auth</Link></li>
              <li><Link href="/servicos/backend-dados" className="hover:text-accent">APIs & Banco de Dados</Link></li>
              <li><Link href="/servicos/performance-marketing" className="hover:text-accent">Performance & GA4</Link></li>
            </ul>
          </nav>

          {/* Social / Contato */}
           <div>
            <h4 className="text-lg font-semibold mb-4"></h4>
            <div className="flex gap-4">
              {/*<a
                href="https://github.com/fullstackpaduavinicius"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent rounded"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>*/}
              {/*<a
                href="https://www.linkedin.com/in/ivan-vin%C3%ADcius-832821330/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent rounded"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>*/}
              {/*<a
                href="https://www.instagram.com/paduaviniciusdev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent rounded"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>*/}
            </div>

            {/*<div className="mt-6 text-sm text-light/80 space-y-1">
              <p><span className="text-light/60">E-mail:</span> <a className="hover:text-accent" href="mailto:fullstackpaduavinicus@gmail.com">fullstackpaduavinicus@gmail.com</a></p>
              <p><span className="text-light/60">WhatsApp:</span> <a className="hover:text-accent" href={waHref}>+55 (79) 99880-7035</a></p>
            </div>*/}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-accent/30">
        <div className="max-w-6xl mx-auto px-6 py-4 text-center text-sm text-light/70">
          © {year} DevSolution Inovadora. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
