'use client';

import { motion } from 'framer-motion';
import { FaInstagram } from 'react-icons/fa';

type Size = 'sm' | 'md' | 'lg';
type Variant = 'solid' | 'outline' | 'ghost';
type Mode = 'button' | 'fab';

type Props = {
  url?: string;
  username?: string; // monta URL se passado
  label?: string;
  size?: Size;
  variant?: Variant;
  mode?: Mode;
  className?: string;
  fullWidth?: boolean;
  trackEvent?: string;
  ariaLabel?: string;
};

export default function InstagramButton({
  url,
  username,
  label = 'Instagram',
  size = 'md',
  variant = 'outline',
  mode = 'button',
  className = '',
  fullWidth = false,
  trackEvent = 'click_instagram',
  ariaLabel,
}: Props) {
  const finalUrl = url || (username ? `https://www.instagram.com/${username.replace(/^@/, '')}` : '#');

  const sizeCls: Record<Size, string> = {
    sm: mode === 'fab' ? 'h-9 w-9' : 'px-3 py-2 text-xs',
    md: mode === 'fab' ? 'h-11 w-11' : 'px-4 py-2.5 text-sm',
    lg: mode === 'fab' ? 'h-12 w-12' : 'px-5 py-3 text-base',
  };

  // degrade “Instagram-like” sutil só no solid
  const variantCls: Record<Variant, string> = {
    solid:
      mode === 'fab'
        ? 'bg-gradient-to-b from-pink-500 via-fuchsia-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
        : 'bg-gradient-to-b from-pink-500 via-fuchsia-500 to-purple-600 text-white shadow-md hover:shadow-lg',
    outline:
      mode === 'fab'
        ? 'bg-white/90 text-primary border border-primary shadow-sm hover:bg-white'
        : 'border border-primary text-primary hover:bg-primary/10',
    ghost:
      mode === 'fab'
        ? 'bg-white/80 text-primary shadow hover:bg-white'
        : 'text-primary hover:bg-primary/10',
  };

  const base =
    mode === 'fab'
      ? 'inline-flex items-center justify-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-white'
      : 'inline-flex items-center gap-2 rounded-xl transition backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-transparent';

  return (
    <motion.a
      href={finalUrl}
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
      <FaInstagram className={mode === 'fab' ? 'text-[18px]' : 'text-[16px]'} />
      {mode !== 'fab' && <span className="font-semibold">{label}</span>}
    </motion.a>
  );
}
