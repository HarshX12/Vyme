'use client';

import { useState } from 'react';
import ChatWidget from '../components/ChatWidget';

/* ==================================================================== */
/*  Kadence storefront — a real instrument e-commerce product listing.   */
/*  The floating Vyme chatbot sits on top of this page.                  */
/* ==================================================================== */

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=70`;

const inr = (n: number) => '₹' + n.toLocaleString('en-IN');

type Category = 'Guitars' | 'Keys' | 'Strings' | 'Percussion';

type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  mrp?: number;
  rating: number;
  reviews: number;
  image: string;
  glyph: string;
  tint: string;
};

const CATALOG: Product[] = [
  { id: 'yamaha-f310', name: 'Yamaha F310 Acoustic Guitar', category: 'Guitars', price: 9500, mrp: 11000, rating: 4.6, reviews: 1240, image: img('1510915361894-db8b60106cb1'), glyph: '🎸', tint: '#D97C4C' },
  { id: 'fender-cd60s', name: 'Fender CD-60S Dreadnought', category: 'Guitars', price: 16500, mrp: 19000, rating: 4.7, reviews: 860, image: img('1558098329-a11cff621064'), glyph: '🎸', tint: '#C2612F' },
  { id: 'epiphone-dr100', name: 'Epiphone DR-100 Acoustic', category: 'Guitars', price: 12000, rating: 4.4, reviews: 430, image: img('1541689592655-f5f52825a3b8'), glyph: '🎸', tint: '#B8532A' },
  { id: 'squier-strat', name: 'Squier Bullet Stratocaster', category: 'Guitars', price: 14000, mrp: 16000, rating: 4.5, reviews: 910, image: img('1564186763535-ebb21ef5277f'), glyph: '🎸', tint: '#A8441F' },
  { id: 'ibanez-grx70', name: 'Ibanez GRX70QA Electric', category: 'Guitars', price: 18500, rating: 4.6, reviews: 520, image: img('1568193755668-aae18714a9f1'), glyph: '🎸', tint: '#8E3F1E' },
  { id: 'fender-player-strat', name: 'Fender Player Stratocaster', category: 'Guitars', price: 72000, mrp: 79000, rating: 4.9, reviews: 310, image: img('1516924962500-2b4b3b99ea02'), glyph: '🎸', tint: '#C2612F' },
  { id: 'casio-cdp-s110', name: 'Casio CDP-S110 Digital Piano', category: 'Keys', price: 32000, rating: 4.5, reviews: 640, image: img('1520523839897-bd0b52f945a0'), glyph: '🎹', tint: '#7B6CF6' },
  { id: 'yamaha-p45', name: 'Yamaha P-45 Digital Piano', category: 'Keys', price: 38000, mrp: 42000, rating: 4.8, reviews: 1120, image: img('1538402074774-8e624f3f7e5d'), glyph: '🎹', tint: '#5B4BE0' },
  { id: 'stentor-student-ii', name: 'Stentor Student II Violin', category: 'Strings', price: 18000, rating: 4.4, reviews: 280, image: img('1612225330812-01a9c6b355ec'), glyph: '🎻', tint: '#A8441F' },
  { id: 'cremona-sv75', name: 'Cremona SV-75 Violin Outfit', category: 'Strings', price: 13500, mrp: 15500, rating: 4.3, reviews: 190, image: img('1624367171718-14026220ee35'), glyph: '🎻', tint: '#93401F' },
  { id: 'kadence-mandolin-a', name: 'Kadence A-Style Mandolin', category: 'Strings', price: 11500, rating: 4.5, reviews: 210, image: img('1621419203051-f4e463849784'), glyph: '🪕', tint: '#B07A2B' },
  { id: 'alesis-nitro-mesh', name: 'Alesis Nitro Mesh Drum Kit', category: 'Percussion', price: 42000, mrp: 47000, rating: 4.7, reviews: 560, image: img('1519892300165-cb5542fb47c7'), glyph: '🥁', tint: '#2E7D6B' },
];

const FILTERS: Array<'All' | Category> = ['All', 'Guitars', 'Keys', 'Strings', 'Percussion'];

/* ----- icons ----- */

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  );
}

function StarRating({ value, reviews }: { value: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1 text-[11px] text-neutral-500">
      <span className="inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-700">
        {value.toFixed(1)}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z" />
        </svg>
      </span>
      <span>({reviews.toLocaleString('en-IN')})</span>
    </div>
  );
}

/* ----- product card (real photo + gradient/glyph fallback) ----- */

function ProductCard({ p }: { p: Product }) {
  const off = p.mrp ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
      <div className="relative aspect-[4/3]" style={{ background: `linear-gradient(135deg, ${p.tint}, ${p.tint}99)` }}>
        <span className="absolute inset-0 grid place-items-center text-4xl drop-shadow-sm">{p.glyph}</span>
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        {off > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
            {off}% OFF
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{p.category}</p>
        <h3 className="mt-0.5 line-clamp-2 min-h-[2.4em] text-[13px] font-semibold leading-tight text-neutral-800">
          {p.name}
        </h3>
        <div className="mt-1.5">
          <StarRating value={p.rating} reviews={p.reviews} />
        </div>

        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-[15px] font-extrabold text-neutral-900">{inr(p.price)}</span>
          {p.mrp && <span className="text-[11px] text-neutral-400 line-through">{inr(p.mrp)}</span>}
        </div>
        <p className="text-[10px] text-neutral-400">EMI from {inr(Math.round(p.price / 12))}/mo</p>

        <button
          type="button"
          className="mt-3 min-h-[40px] w-full rounded-full text-[13px] font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
          style={{ background: 'linear-gradient(135deg, #D97C4C, #B8532A)' }}
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}

/* ==================================================================== */

export default function Store() {
  const [filter, setFilter] = useState<'All' | Category>('All');
  const items = filter === 'All' ? CATALOG : CATALOG.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800">
      {/* ---------------- Header ---------------- */}
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3">
          <span className="text-xl font-extrabold tracking-tight">Kadence</span>
          <nav className="ml-4 hidden gap-5 text-sm font-medium text-neutral-500 lg:flex">
            <span>Guitars</span>
            <span>Keys</span>
            <span>Strings</span>
            <span>Percussion</span>
            <span>Stores</span>
          </nav>

          <div className="ml-auto hidden items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5 text-sm text-neutral-500 sm:flex sm:w-64">
            <SearchIcon />
            <input
              placeholder="Search instruments…"
              aria-label="Search instruments"
              className="min-w-0 flex-1 bg-transparent placeholder:text-neutral-400 focus:outline-none"
            />
          </div>
          <button type="button" aria-label="Cart" className="grid h-9 w-9 place-items-center rounded-full text-neutral-600 transition hover:bg-neutral-100">
            <CartIcon />
          </button>
        </div>
      </header>

      {/* ---------------- Listing ---------------- */}
      <main className="mx-auto max-w-6xl px-5 py-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">Shop instruments</h1>
            <p className="text-sm text-neutral-500">
              {items.length} products · free setup · try in-store at Bengaluru &amp; Delhi
            </p>
          </div>
        </div>

        {/* Filter chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`min-h-[36px] rounded-full px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 ${
                  active
                    ? 'text-white shadow-sm'
                    : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
                style={active ? { background: 'linear-gradient(135deg, #D97C4C, #B8532A)' } : undefined}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Product grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </main>

      {/* Floating Vyme chatbot launcher */}
      <ChatWidget />
    </div>
  );
}
