'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Tipos

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: 'GA4 & SEO' | 'E-commerce' | 'Automações' | 'MVP & Startup';
  tags: string[];
  featured?: boolean;
  cover?: string;
  content: string; // texto do modal
};

const POSTS: Post[] = [
  {
    slug: 'ga4-eventos-essenciais-para-sites-que-convertem',
    title: 'GA4: eventos essenciais para sites que convertem',
    excerpt: 'Quais eventos implementar para medir funil (view → clique → lead) sem perder sinal?',
    category: 'GA4 & SEO',
    tags: ['GA4', 'Medição', 'Funil'],
    featured: true,
    cover: '/1.png',
    content:
      'Neste artigo explicativo, você entende como mapear os eventos base do GA4 para um funil simples (view → clique em CTA → envio de lead). Mostro o que é evento, parâmetros recomendados (page_location, content_type, cta_label), como configurar Enhanced Measurement sem poluir dados e quando criar eventos personalizados via gtag/Tag Manager. No final, há um checklist rápido para validar tudo via DebugView.',
  },
  {
    slug: 'ecommerce-performance-checklist-2025',
    title: 'E-commerce: checklist de performance para 2025',
    excerpt: 'Lighthouse, Core Web Vitals e UX: o que revisar antes de escalar tráfego pago.',
    category: 'E-commerce',
    tags: ['Performance', 'UX', 'CWV'],
    cover: '/2.png',
    content:
      'Resumo prático do que conferir no seu e-commerce antes de aumentar o investimento em mídia: LCP, CLS, INP, imagens responsivas, lazy-loading, split de bundles, cache, e microinterações que afetam conversão. Inclui uma sequência de auditoria com Lighthouse/PSI e dicas para priorizar correções que trazem mais impacto.',
  },
  {
    slug: 'automacoes-que-economizam-horas',
    title: 'Automações que economizam horas por semana',
    excerpt: 'RPA + integrações: exemplos práticos para reduzir tarefas repetitivas.',
    category: 'Automações',
    tags: ['RPA', 'Integrações', 'Produtividade'],
    cover: '/3.png',
    content:
      'Como identificar processos candidatos a automação (planilhas, copy-paste, conciliações) e orquestrar integrações com webhooks, filas e jobs. Falo de ROI, riscos comuns e um roteiro para sair do zero com pequenas automações úteis que pagam o projeto em semanas.',
  },
  {
    slug: 'mvp-em-semanas-com-react-node',
    title: 'MVP em semanas com React + Node',
    excerpt: 'Como priorizar escopo, medir uso e evitar sobre-engenharia no MVP.',
    category: 'MVP & Startup',
    tags: ['MVP', 'Product', 'Tech'],
    cover: '/4.png',
    content:
      'Guia rápido para tirar um MVP em poucas semanas: recorte de escopo, feature flags, telemetria mínima (rastros de uso), feedback loops, e como planejar refactor sem travar o aprendizado de produto. Inclui uma matriz simples para escolher o que entra no v1.',
  },
];

const CATEGORIES = ['Todos', 'GA4 & SEO', 'E-commerce', 'Automações', 'MVP & Startup'] as const;
type Category = (typeof CATEGORIES)[number];

export default function BlogPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('Todos');
  const [tag, setTag] = useState<string>('Todos');
  const [activePost, setActivePost] = useState<Post | null>(null);

  const categoryOptions = useMemo<string[]>(() => [...CATEGORIES], []);

  const tagsAll = useMemo(() => {
    const t = new Set<string>();
    POSTS.forEach((p) => p.tags.forEach((x) => t.add(x)));
    return ['Todos', ...Array.from(t).sort()];
  }, []);

  const featured = useMemo(() => POSTS.find((p) => p.featured), []);
  const rest = useMemo(() => POSTS.filter((p) => !p.featured), []);

  const filtered = useMemo(() => {
    const list = [featured, ...rest].filter(Boolean) as Post[];
    return list.filter((p) => {
      const matchCat = category === 'Todos' || p.category === category;
      const matchTag = tag === 'Todos' || p.tags.includes(tag);
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchTag && matchQ;
    });
  }, [featured, rest, category, tag, query]);

  return (
    <main className="pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero */}
        <section id="topo" className="mb-8 scroll-mt-20">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Blog</h1>
          <p className="text-secondary mt-2 max-w-2xl">
            Conteúdo prático sobre desenvolvimento web, e-commerce, automações e mensuração com GA4 — sempre focado em
            resultado.
          </p>
        </section>

        {/* Busca e filtros */}
        <section className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-8">
          <div className="flex flex-1 gap-3">
            <div className="flex-1">
              <label htmlFor="q" className="sr-only">Buscar</label>
              <input
                id="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por título, tag ou assunto…"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="hidden md:flex gap-3">
              <CategorySelect value={category} onChange={(v) => setCategory(v)} />
              <TagSelect value={tag} onChange={setTag} options={tagsAll} />
            </div>
          </div>

          {/* Pílulas (mobile) */}
          <div className="md:hidden flex gap-2 overflow-x-auto no-scrollbar">
            <Pills items={categoryOptions} value={category} onChange={(v) => setCategory(v as Category)} />
            <Pills items={tagsAll} value={tag} onChange={setTag} />
          </div>
        </section>

        {/* Destaque */}
        {filtered[0] && filtered[0].slug === featured?.slug && (
          <FeaturedCard post={filtered[0]} onOpen={() => setActivePost(filtered[0])} />
        )}

        {/* Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered
            .filter((p) => p.slug !== featured?.slug)
            .map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} onOpen={() => setActivePost(post)} />
            ))}
        </section>

        {/* Vazio */}
        {filtered.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-secondary">Nenhum artigo encontrado. Tente outros filtros ou termos.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <ArticleModal post={activePost} onClose={() => setActivePost(null)} />
    </main>
  );
}

/* ---------- Components ---------- */

function CategoryBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent/10 text-accent px-2.5 py-1 text-xs font-medium">
      {children}
    </span>
  );
}

function FeaturedCard({ post, onOpen }: { post: Post; onOpen: () => void }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl overflow-hidden border border-gray-200 bg-white"
    >
      {post.cover ? (
        <img src={post.cover} alt="cover" className="w-full h-auto object-contain" />
      ) : (
        <div className="h-56 md:h-72 bg-gray-100" />
      )}

      <div className="p-5 md:p-6">
        <div className="flex items-center gap-3 mb-2">
          <CategoryBadge>{post.category}</CategoryBadge>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-primary mb-2">{post.title}</h2>
        <p className="text-secondary">{post.excerpt}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t} className="px-2 py-1 text-xs rounded bg-light text-primary">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5">
          <button
            onClick={onOpen}
            className="inline-block rounded-lg px-3 py-2 text-sm font-semibold bg-accent text-black hover:opacity-90 transition"
            data-gtag="blog_open_featured_modal"
          >
            Ler artigo
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function PostCard({ post, index, onOpen }: { post: Post; index: number; onOpen: () => void }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
      className="rounded-xl overflow-hidden border border-gray-200 bg-white flex flex-col"
    >
      {post.cover ? (
        <img src={post.cover} alt="cover" className="w-full h-auto object-contain" />
      ) : (
        <div className="h-40 bg-gray-100" />
      )}

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          <CategoryBadge>{post.category}</CategoryBadge>
        </div>

        <h3 className="text-lg font-bold text-primary">{post.title}</h3>
        <p className="text-secondary text-sm mt-2 flex-1">{post.excerpt}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t} className="px-2 py-1 text-xs rounded bg-light text-primary">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4">
          <button
            onClick={onOpen}
            className="text-sm font-semibold text-accent hover:opacity-80"
            data-gtag="blog_open_card_modal"
          >
            Ler artigo →
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function CategorySelect({ value, onChange }: { value: Category; onChange: (v: Category) => void }) {
  return (
    <div>
      <label htmlFor="cat" className="sr-only">Categoria</label>
      <select
        id="cat"
        value={value}
        onChange={(e) => onChange(e.target.value as Category)}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}

function TagSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label htmlFor="tag" className="sr-only">Tag</label>
      <select
        id="tag"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {options.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  );
}

function Pills({ items, value, onChange }: { items: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2">
      {items.map((it) => {
        const active = it === value;
        return (
          <button
            key={it}
            onClick={() => onChange(it)}
            className={[
              'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium border',
              active ? 'bg-accent text-black border-accent' : 'bg-white text-primary border-gray-200',
            ].join(' ')}
          >
            {it}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Modal ---------- */

function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = locked ? 'hidden' : original;
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}

function ArticleModal({ post, onClose }: { post: Post | null; onClose: () => void }) {
  useLockBodyScroll(!!post);

  return (
    <AnimatePresence>
      {post && (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <motion.button
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-label="Fechar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Card */}
          <motion.div
            className="absolute inset-x-0 md:inset-auto md:right-8 md:left-8 top-16 bottom-8 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="p-4 md:p-5 border-b border-gray-100 flex items-start justify-between gap-4">
              <div>
                <div className="mb-1"><CategoryBadge>{post.category}</CategoryBadge></div>
                <h2 className="text-xl md:text-2xl font-bold text-primary">{post.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg px-3 py-1.5 text-sm font-medium border border-gray-200 hover:bg-gray-50"
                aria-label="Fechar"
              >
                Fechar
              </button>
            </div>

            {/* Cover opcional (sem corte) */}
            {post.cover && (
              <div className="p-0 m-0">
                <img src={post.cover} alt="cover" className="w-full h-auto object-contain" />
              </div>
            )}

            {/* Conteúdo */}
            <div className="p-4 md:p-6 overflow-y-auto">
              <p className="text-secondary leading-relaxed whitespace-pre-line">{post.content}</p>
            </div>

            {/* Rodapé simples (sem link) */}
            <div className="p-4 md:p-5 border-t border-gray-100 flex items-center justify-start">
              <div className="text-xs text-secondary">*Resumo explicativo baseado no tema do artigo.</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
