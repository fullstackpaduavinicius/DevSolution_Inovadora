import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
 // Importe o novo componente

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DevSolutions - Desenvolvimento Web e Automações',
  description: 'Soluções digitais sob medida para seu negócio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        
      </body>
    </html>
  );
}