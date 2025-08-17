'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: 'GA4 & SEO' | 'E-commerce' | 'Automações' | 'MVP & Startup';
  tags: string[];
  featured?: boolean;
  cover?: string;
};

const POSTS: Post[] = [
  {
    slug: 'ga4-eventos-essenciais-para-sites-que-convertem',
    title: 'GA4: eventos essenciais para sites que convertem',
    excerpt: 'Quais eventos implementar para medir funil (view → clique → lead) sem perder sinal?',
    date: '2025-07-10',
    readTime: '7 min',
    category: 'GA4 & SEO',
    tags: ['GA4', 'Medição', 'Funil'],
    featured: true,
    cover: '/covers/ga4-essenciais.jpg',
  },
  {
    slug: 'ecommerce-performance-checklist-2025',
    title: 'E-commerce: checklist de performance para 2025',
    excerpt: 'Lighthouse, Core Web Vitals e UX: o que revisar antes de escalar tráfego pago.',
    date: '2025-06-15',
    readTime: '6 min',
    category: 'E-commerce',
    tags: ['Performance', 'UX', 'CWV'],
    cover: '/covers/ecommerce-performance.jpg',
  },
  {
    slug: 'automacoes-que-economizam-horas',
    title: 'Automações que economizam horas por semana',
    excerpt: 'RPA + integrações: exemplos práticos para reduzir tarefas repetitivas.',
    date: '2025-05-22',
    readTime: '5 min',
    category: 'Automações',
    tags: ['RPA', 'Integrações', 'Produtividade'],
    cover: '/covers/automacoes.jpg',
  },
  {
    slug: 'mvp-em-semanas-com-react-node',
    title: 'MVP em semanas com React + Node',
    excerpt: 'Como priorizar escopo, medir uso e evitar sobre-engenharia no MVP.',
    date: '2025-04-30',
    readTime: '8 min',
    category: 'MVP & Startup',
    tags: ['MVP', 'Product', 'Tech'],
    cover: '/covers/mvp.jpg',
  },
];

const CATEGORIES = ['Todos', 'GA4 & SEO', 'E-commerce', 'Automações', 'MVP & Startup'] as const;

export default function BlogPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Todos');
  const [tag, setTag] = useState<string>('Todos');

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

  {/* pt-20 compensa o header fixo h-14 (56px) + respiro */}
  return (
    
    <main className="pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero/resumo do blog */}
        <section id="topo" className="mb-8 scroll-mt-20">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Blog</h1>
          <p className="text-secondary mt-2 max-w-2xl">
            Conteúdo prático sobre desenvolvimento web, e-commerce, automações e mensuração com GA4 — sempre focado em resultado.
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
              <CategorySelect value={category} onChange={setCategory} />
              <TagSelect value={tag} onChange={setTag} options={tagsAll} />
            </div>
          </div>

          {/* Filtros em pílulas (mobile) */}
          <div className="md:hidden flex gap-2 overflow-x-auto no-scrollbar">
            <Pills items={CATEGORIES as unknown as string[]} value={category} onChange={setCategory as any} />
            <Pills items={tagsAll} value={tag} onChange={setTag} />
          </div>
        </section>

        {/* Destaque (se ainda passar no filtro) */}
        {filtered[0] && filtered[0].slug === featured?.slug && <FeaturedCard post={filtered[0]} />}

        {/* Grid de posts */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered
            .filter((p) => p.slug !== featured?.slug)
            .map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
        </section>

        {/* Estado vazio */}
        {filtered.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-secondary">Nenhum artigo encontrado. Tente outros filtros ou termos.</p>
          </div>
        )}
      </div>
    </main>
  );
}

/* ---------- Components ---------- */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function CategoryBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent/10 text-accent px-2.5 py-1 text-xs font-medium">
      {children}
    </span>
  );
}

function FeaturedCard({ post }: { post: Post }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl overflow-hidden border border-gray-200 bg-white"
    >
      {post.cover ? (
        <div className="h-56 md:h-72 bg-cover bg-center" style={{ backgroundImage: `url(${post.cover})` }} aria-hidden />
      ) : (
        <div className="h-56 md:h-72 bg-gray-100" />
      )}

      <div className="p-5 md:p-6">
        <div className="flex items-center gap-3 mb-2">
          <CategoryBadge>{post.category}</CategoryBadge>
          <span className="text-secondary text-xs">
            {formatDate(post.date)} • {post.readTime}
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-primary mb-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-accent">
            {post.title}
          </Link>
        </h2>
        <p className="text-secondary">{post.excerpt}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t} className="px-2 py-1 text-xs rounded bg-light text-primary">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-block rounded-lg px-3 py-2 text-sm font-semibold bg-accent text-black hover:opacity-90 transition"
            data-gtag="blog_read_featured"
          >
            Ler artigo
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
      className="rounded-xl overflow-hidden border border-gray-200 bg-white flex flex-col"
    >
      {post.cover ? (
        <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${post.cover})` }} aria-hidden />
      ) : (
        <div className="h-40 bg-gray-100" />
      )}

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          <CategoryBadge>{post.category}</CategoryBadge>
          <span className="text-secondary text-xs">
            {formatDate(post.date)} • {post.readTime}
          </span>
        </div>

        <h3 className="text-lg font-bold text-primary">
          <Link href={`/blog/${post.slug}`} className="hover:text-accent">
            {post.title}
          </Link>
        </h3>
        <p className="text-secondary text-sm mt-2 flex-1">{post.excerpt}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t} className="px-2 py-1 text-xs rounded bg-light text-primary">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4">
          <Link
            href={`/blog/${post.slug}`}
            className="text-sm font-semibold text-accent hover:opacity-80"
            data-gtag="blog_read_card"
          >
            Ler artigo →
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function CategorySelect({
  value,
  onChange,
}: {
  value: typeof CATEGORIES[number];
  onChange: (v: typeof CATEGORIES[number]) => void;
}) {
  return (
    <div>
      <label htmlFor="cat" className="sr-only">
        Categoria
      </label>
      <select
        id="cat"
        value={value}
        onChange={(e) => onChange(e.target.value as any)}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}

function TagSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label htmlFor="tag" className="sr-only">
        Tag
      </label>
      <select
        id="tag"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {options.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}

function Pills({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) {
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
