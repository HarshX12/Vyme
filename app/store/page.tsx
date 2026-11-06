'use client';

import ChatWidget from '../components/ChatWidget';

/* ==================================================================== */
/*  Kadence homepage (reference layout, top sections → Shop by          */
/*  Collections). Fully mobile-responsive. The floating Vyme chatbot     */
/*  sits on top of this page.                                            */
/* ==================================================================== */

const img = (id: string, w = 700) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

const INDIGO = 'linear-gradient(135deg, #7B6CF6, #5B4BE0)';

/* ----- content ----- */

const CATEGORIES = [
  { label: 'Amplifiers', glyph: '🔊' },
  { label: 'Digital Pianos', glyph: '🎹' },
  { label: 'Electric Drum sets', glyph: '🥁' },
  { label: 'Ukulele', glyph: '🪕' },
  { label: 'Stands', glyph: '🎚️' },
  { label: 'Saxophones', glyph: '🎷' },
  { label: 'Travel Guitars', glyph: '🎸' },
  { label: 'Audio Mixer', glyph: '🎛️' },
];

const BESTSELLERS = [
  { label: 'Premium Guitars', image: img('1541689592655-f5f52825a3b8', 700) },
  { label: 'Concert Ukulele', image: img('1758002102952-6d61ea980980', 700) },
  { label: 'Digital Pianos', image: img('1538402074774-8e624f3f7e5d', 700) },
  { label: 'Microphones', image: img('1485579149621-3123dd979885', 700) },
];

const NEW_LAUNCHES = [
  { label: 'Bass Guitars', image: img('1568193755668-aae18714a9f1', 500) },
  { label: 'Dynamic Microphones', image: img('1521424159246-e4a66f267e4b', 500) },
  { label: 'Nylon Picks', image: img('1558098329-a11cff621064', 500) },
  { label: 'Ukuleles', image: img('1778512924974-bceeca66c499', 500) },
];

const COLLECTIONS = [
  { label: 'Stands', image: img('1557855684-8aa6f40997df', 500) },
  { label: 'Accessories', image: img('1776611673493-685e3ee53b30', 500) },
  { label: 'Solid wood guitars', image: img('1510915361894-db8b60106cb1', 500) },
  { label: 'Electric Guitars', image: img('1564186763535-ebb21ef5277f', 500) },
  { label: 'Budget Guitars', image: img('1516924962500-2b4b3b99ea02', 500) },
  { label: 'Timeless Gifts', image: img('1624247079844-d306e0157dbb', 500) },
];

/* ----- small helpers ----- */

function Photo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`h-full w-full object-cover ${className}`}
      onError={(e) => {
        e.currentTarget.style.visibility = 'hidden';
      }}
    />
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center text-lg font-extrabold tracking-tight text-neutral-800 sm:text-2xl">
      {children}
    </h2>
  );
}

function ViewAll() {
  return (
    <div className="mt-5 flex justify-center">
      <button
        type="button"
        className="rounded-full border border-neutral-300 bg-white px-6 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
      >
        View All
      </button>
    </div>
  );
}

/* ==================================================================== */

export default function KadenceHome() {
  return (
    <div className="min-h-screen bg-white text-neutral-800">
      {/* ---------------- Header ---------------- */}
      <header className="sticky top-0 z-30 bg-neutral-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <span className="text-lg font-extrabold tracking-tight">KADENCE</span>

          {/* Search (hidden on small screens) */}
          <div className="ml-2 hidden min-w-0 flex-1 items-center gap-2 rounded-full bg-neutral-800 px-3 py-1.5 text-sm text-neutral-300 md:flex">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input placeholder='Search for "Guitars"' aria-label="Search" className="min-w-0 flex-1 bg-transparent placeholder:text-neutral-500 focus:outline-none" />
          </div>

          {/* Primary nav */}
          <nav className="ml-auto hidden items-center gap-1 text-sm font-medium sm:flex">
            {['Shop', 'Learn', 'Bookings', 'Rentals'].map((t, i) => (
              <span
                key={t}
                className={`rounded-full px-3 py-1.5 ${i === 0 ? 'text-white' : 'text-neutral-300'}`}
                style={i === 0 ? { background: INDIGO } : undefined}
              >
                {t}
              </span>
            ))}
          </nav>

          <button type="button" aria-label="Cart" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-neutral-200 transition hover:bg-neutral-800 sm:ml-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></svg>
          </button>
          <button type="button" className="shrink-0 rounded-full border border-neutral-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-neutral-800">
            Log In
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4">
        {/* ---------------- Hero ---------------- */}
        <section className="pt-4">
          <div className="relative overflow-hidden rounded-2xl bg-neutral-800 sm:rounded-3xl">
            <div className="absolute inset-0">
              <Photo src={img('1510915361894-db8b60106cb1', 1200)} alt="Tennessee series guitar" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />
            </div>

            <div className="relative flex min-h-[320px] flex-col justify-end p-5 sm:min-h-[440px] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">Now Viewing</p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Tennessee series</h1>
            </div>

            {/* "Now viewing" product card */}
            <div className="absolute right-3 top-3 w-40 rounded-xl bg-white/95 p-2.5 shadow-lg backdrop-blur sm:right-5 sm:top-5 sm:w-52 sm:p-3">
              <div className="h-20 overflow-hidden rounded-lg bg-neutral-100 sm:h-28">
                <Photo src={img('1564186763535-ebb21ef5277f', 400)} alt="Kadence STBK Tennessee" />
              </div>
              <p className="mt-2 text-[11px] font-semibold leading-tight text-neutral-800 sm:text-[12px]">
                Kadence STBK Tennessee 39″ Electric Guitar
              </p>
              <p className="mt-0.5 text-[13px] font-extrabold text-neutral-900">₹9,999.00</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex gap-2 text-neutral-400">
                  <span>⏮</span><span>▶</span><span>⏭</span>
                </div>
                <span className="grid h-6 w-6 place-items-center rounded-md text-white" style={{ background: INDIGO }}>♪</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Explore more categories ---------------- */}
        <section className="py-10 sm:py-12">
          <SectionTitle>Explore more categories</SectionTitle>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:gap-5 sm:overflow-visible lg:grid-cols-8">
            {CATEGORIES.map((c) => (
              <div key={c.label} className="flex w-20 shrink-0 flex-col items-center text-center sm:w-auto">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-neutral-100 text-2xl shadow-sm sm:h-20 sm:w-20">
                  {c.glyph}
                </div>
                <p className="mt-2 text-[11px] font-medium leading-tight text-neutral-600">{c.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- Our Bestsellers ---------------- */}
        <section className="py-6">
          <SectionTitle>Our Bestsellers</SectionTitle>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {BESTSELLERS.map((b) => (
              <div key={b.label} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-800">
                <Photo src={b.image} alt={b.label} className="transition duration-500 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <p className="absolute left-3 top-3 max-w-[8rem] text-sm font-extrabold uppercase leading-snug tracking-[0.15em] text-white sm:text-base">
                  {b.label}
                </p>
              </div>
            ))}
          </div>
          <ViewAll />
        </section>

        {/* ---------------- Our New Launches ---------------- */}
        <section className="py-10 sm:py-12">
          <SectionTitle>Our New Launches</SectionTitle>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {NEW_LAUNCHES.map((n) => (
              <div key={n.label} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="border-l-2 border-neutral-800 px-3 pt-3 text-[13px] font-bold text-neutral-800">{n.label}</div>
                <div className="h-36 sm:h-44">
                  <Photo src={n.image} alt={n.label} />
                </div>
              </div>
            ))}
          </div>
          <ViewAll />
        </section>

        {/* ---------------- Shop by Collections ---------------- */}
        <section className="py-6 pb-14">
          <SectionTitle>Shop by Collections</SectionTitle>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {COLLECTIONS.map((c) => (
              <div key={c.label} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                <div className="h-24 bg-neutral-100 sm:h-28">
                  <Photo src={c.image} alt={c.label} />
                </div>
                <div className="p-2.5">
                  <p className="text-[12px] font-bold leading-tight text-neutral-800">{c.label}</p>
                  <p className="mt-0.5 text-[11px] text-neutral-400">From ₹1,100</p>
                </div>
              </div>
            ))}
          </div>
          <ViewAll />
        </section>
      </main>

      {/* Floating Vyme chatbot launcher */}
      <ChatWidget />
    </div>
  );
}
