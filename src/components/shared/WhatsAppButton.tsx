'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

type Size = 'sm' | 'md' | 'lg';
type Variant = 'solid' | 'outline' | 'ghost';
type Mode = 'button' | 'fab';

type Props = {
  phone: string; // ex: '5579998807035'
  label?: string;
  message?: string;
  utm?: { source?: string; medium?: string; campaign?: string };
  size?: Size;
  variant?: Variant;
  mode?: Mode;
  className?: string;
  fullWidth?: boolean;
  trackEvent?: string;
  ariaLabel?: string;
};

export default function WhatsAppButton({
  phone,
  label = 'WhatsApp',
  message = 'Olá! Vim pelo site e quero falar com você.',
  utm,
  size = 'md',
  variant = 'solid',
  mode = 'button',
  className = '',
  fullWidth = false,
  trackEvent = 'click_whatsapp',
  ariaLabel,
}: Props) {
  const href = useMemo(() => {
    const text = encodeURIComponent(message);
    const qs = new URLSearchParams();
    if (utm?.source) qs.set('utm_source', utm.source!);
    if (utm?.medium) qs.set('utm_medium', utm.medium!);
    if (utm?.campaign) qs.set('utm_campaign', utm.campaign!);
    const tail = qs.toString();
    return `https://wa.me/${phone}?text=${text}${tail ? `&${tail}` : ''}`;
  }, [phone, message, utm]);

  const sizeCls: Record<Size, string> = {
    sm: mode === 'fab' ? 'h-9 w-9' : 'px-3 py-2 text-xs',
    md: mode === 'fab' ? 'h-11 w-11' : 'px-4 py-2.5 text-sm',
    lg: mode === 'fab' ? 'h-12 w-12' : 'px-5 py-3 text-base',
  };

  const variantCls: Record<Variant, string> = {
    solid:
      mode === 'fab'
        ? 'bg-gradient-to-b from-green-400 to-green-500 text-black shadow-lg hover:shadow-xl'
        : 'bg-gradient-to-b from-green-400 to-green-500 text-black shadow-md hover:shadow-lg',
    outline:
      mode === 'fab'
        ? 'bg-white/90 text-green-600 border border-green-400 shadow-sm hover:bg-white'
        : 'border border-green-400 text-green-600 hover:bg-green-50',
    ghost:
      mode === 'fab'
        ? 'bg-white/80 text-green-600 shadow hover:bg-white'
        : 'text-green-600 hover:bg-green-50',
  };

  const base =
    mode === 'fab'
      ? 'inline-flex items-center justify-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 focus-visible:ring-offset-white'
      : 'inline-flex items-center gap-2 rounded-xl transition backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 focus-visible:ring-offset-transparent';

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel || label}
      data-gtag={trackEvent}
      whileHover={{ scale: 1.03, translateY: -1 }}
      whileTap={{ scale: 0.98 }}
      className={[
        base,
        sizeCls[size],
        variantCls[variant],
        fullWidth && mode !== 'fab' ? 'w-full justify-center' : '',
        className,
      ].join(' ')}
    >
      <FaWhatsapp className={mode === 'fab' ? 'text-[18px]' : 'text-[16px]'} />
      {mode !== 'fab' && <span className="font-semibold">{label}</span>}
    </motion.a>
  );
}
