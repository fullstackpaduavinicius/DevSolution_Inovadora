'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { FaLaptopCode, FaWhatsapp, FaBars, FaTimes, FaUserTie } from 'react-icons/fa';

const NAV = [
  { label: 'Sobre', href: '/about' },
  { label: 'Serviços', href: '/services' },
  { label: 'Nossas Soluções', href: '/nossas-solucoes' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contato', href: '/contact' },
  { label: 'Trabalhe Conosco', href: '/trabalhe-conosco' }, // Corrigido para usar hífen
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname() || '/';
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest < 100) {
      setIsVisible(true);
      return;
    }

    if (latest > lastScrollY && latest > 100) {
      setIsVisible(false);
    } else if (latest < lastScrollY) {
      setIsVisible(true);
    }
    setLastScrollY(latest);
  });

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const waHref = useMemo(() => {
    const phone = '5579998807035';
    const text = encodeURIComponent(
      'Olá! Vim pelo site da DevSolution Inovadora e quero solicitar um orçamento.'
    );
    const utms = new URLSearchParams({
      utm_source: 'site',
      utm_medium: 'header_cta',
      utm_campaign: 'lead_devsolution',
    }).toString();
    return `https://wa.me/${phone}?text=${text}&${utms}`;
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-0 left-0 right-0 z-50 border-b bg-primary border-accent/20 text-light"
          role="banner"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="h-14 flex items-center justify-between gap-4">
              <Link href="/" aria-label="Home" className="flex items-center gap-2">
                <FaLaptopCode size={20} className="text-accent" />
                <span className="text-lg font-bold">
                  DevSolution <span className="text-accent">Inovadora</span>
                </span>
              </Link>

              {/* Menu Desktop */}
              <nav className="hidden md:flex items-center gap-5" aria-label="Navegação principal">
                {NAV.map((item) => (
                  <motion.div
                    key={item.href}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      className={[
                        'text-xs py-1 transition-colors',
                        isActive(item.href)
                          ? 'text-accent font-medium'
                          : 'text-light/80 hover:text-accent'
                      ].join(' ')}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* CTA + Mobile */}
              <div className="flex items-center gap-2">
                {/* CTA WhatsApp */}
                <motion.a
                  href={waHref}
                  className="hidden sm:inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-accent text-black hover:opacity-90 transition"
                  aria-label="WhatsApp"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaWhatsapp className="text-sm" />
                  <span>Contato</span>
                </motion.a>

                {/* CTA Trabalhe Conosco */}
                <motion.a
                  href="/trabalhe-conosco" // Corrigido para usar hífen
                  className="hidden sm:inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-light text-primary hover:bg-accent hover:text-black transition"
                  aria-label="Trabalhe Conosco"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUserTie className="text-sm" />
                  <span>Trabalhe Conosco</span>
                </motion.a>

                {/* Botão Mobile */}
                <motion.button
                  className="md:hidden inline-flex items-center justify-center rounded-lg p-1.5 focus:outline-none"
                  onClick={() => setIsMenuOpen((v) => !v)}
                  aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                  aria-controls="mobile-menu"
                  aria-expanded={isMenuOpen}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Menu Mobile */}
          <motion.div
            id="mobile-menu"
            initial={false}
            animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-primary/95"
            aria-hidden={!isMenuOpen}
          >
            <div className="px-4 sm:px-6 pb-2 flex flex-col gap-1">
              {NAV.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ x: 20, opacity: 0 }}
                  animate={isMenuOpen ? { x: 0, opacity: 1 } : { x: 20, opacity: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.15 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={[
                      'block rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive(item.href)
                        ? 'bg-accent/10 text-accent font-medium'
                        : 'text-light/90 hover:bg-accent/10 hover:text-accent'
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {/* CTA Mobile WhatsApp e Trabalhe Conosco */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={isMenuOpen ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
                transition={{ delay: NAV.length * 0.05 + 0.1, duration: 0.2 }}
                className="mt-1 flex flex-col gap-2"
              >
                <a
                  href={waHref}
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold bg-accent text-black hover:opacity-90 transition"
                >
                  <FaWhatsapp className="text-sm" />
                  <span>Fale no WhatsApp</span>
                </a>

                <a
                  href="/trabalhe-conosco" // Corrigido para usar hífen
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold bg-light text-primary hover:bg-accent hover:text-black transition"
                >
                  <FaUserTie className="text-sm" />
                  <span>Trabalhe Conosco</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}