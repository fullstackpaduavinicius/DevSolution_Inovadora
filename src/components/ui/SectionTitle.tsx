'use client'; // Adicione se estiver usando hooks

import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

export default function SectionTitle({ title, subtitle, center = false }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-12 ${center ? 'text-center' : ''}`}
    >
      <h2 className="text-3xl font-bold text-primary mb-2">{title}</h2>
      {subtitle && <p className="text-secondary">{subtitle}</p>}
    </motion.div>
  );
}