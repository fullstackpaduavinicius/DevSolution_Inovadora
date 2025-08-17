'use client';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';

export default function CtaSection() {
  return (
    <section className="py-16 bg-secondary text-light">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-6">Pronto para Transformar seu Negócio?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Entre em contato agora mesmo e vamos discutir como podemos ajudar você!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/5579998807035"
              className="bg-accent hover:bg-primary text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <FaWhatsapp size={20} /> WhatsApp
            </motion.a>
            
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:fullstackpaduavincius@gmail.com"
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <FaEnvelope size={20} /> Email
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}