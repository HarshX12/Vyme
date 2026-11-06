'use client';

import { useState } from 'react';
import ChatWidget from '../components/ChatWidget';

/* ==================================================================== */
/*  Kadence AI store — Stage 1: Landing / hero with inline AI bar        */
/*  Design language reused from the Vyme chat UI:                        */
/*   - accent terracotta  #D97C4C → #B8532A (sphere, primary actions)    */
/*   - indigo CTA         #7B6CF6 → #5B4BE0                              */
/*   - radii: cards rounded-3xl, chips/buttons rounded-full              */
/*   - card: bg-white ring-1 ring-black/5 shadow-sm                      */
/*   - AI identity: the sphere avatar + "Vyme" (one icon, no sparkles)   */
/*  Mobile-first (390px); desktop layout at lg.                          */
/* ==================================================================== */

const sphere = {
  background:
    'radial-gradient(circle at 32% 28%, #F4C6A2 0%, #D97C4C 45%, #A8441F 100%)',
};

const inr = (n: number) => '₹' + n.toLocaleString('en-IN');
const emiFrom = (n: number) => inr(Math.round(n / 12)) + '/mo';

/* ----- icons (inline, dependency-free — same style as the chat) ----- */

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/* ----- sample data (static for the UI; swap for real catalog later) - */

type Rec = {
  id: string;
  name: string;
  category: string;
  price: number;
  why: string;
  image: string;
  glyph: string;
  tint: string;
  stock: 'In stock' | 'Low stock';
  store: string;
};

const RECS: Rec[] = [
  {
    id: 'yamaha-f310',
    name: 'Yamaha F310 Acoustic',
    category: 'Acoustic Guitar',
    price: 9500,
    why: 'Forgiving action that suits brand-new fingers.',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=70',
    glyph: '🎸',
    tint: '#D97C4C',
    stock: 'In stock',
    store: 'Bengaluru',
  },
  {
    id: 'fender-cd60s',
    name: 'Fender CD-60S',
    category: 'Acoustic Guitar',
    price: 16500,
    why: 'Solid-top warmth with an easy, rolled fretboard edge.',
    image: 'https://images.unsplash.com/photo-1558098329-a11cff621064?auto=format&fit=crop&w=600&q=70',
    glyph: '🎸',
    tint: '#C2612F',
    stock: 'In stock',
    store: 'Delhi',
  },
  {
    id: 'kadence-mandolin-a',
    name: 'Kadence A-Style Mandolin',
    category: 'Mandolin',
    price: 11500,
    why: 'Bright and compact — a fun step up if you already strum.',
    image: 'https://images.unsplash.com/photo-1621419203051-f4e463849784?auto=format&fit=crop&w=600&q=70',
    glyph: '🪕',
    tint: '#B07A2B',
    stock: 'Low stock',
    store: 'Bengaluru',
  },
];

const INTENTS = ['Beginner', 'Upgrading', 'Gifting'] as const;
const INSTRUMENTS = ['Guitar', 'Piano', 'Violin', 'Drums'] as const;
const BUDGETS = ['Under ₹10k', '₹10k–₹20k', '₹20k+'] as const;

type Step = 'intent' | 'instrument' | 'budget' | 'results';

/* ==================================================================== */

export default function StoreLanding() {
  const [audience, setAudience] = useState<'new' | 'returning'>('new');
  const [step, setStep] = useState<Step>('intent');
  const [intent, setIntent] = useState<string | null>(null);
  const [instrument, setInstrument] = useState<string | null>(null);

  function reset() {
    setStep('intent');
    setIntent(null);
    setInstrument(null);
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800">
      {/* ---------------- Top nav (reused store chrome) ---------------- */}
      <header className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-4">
        <span className="text-xl font-extrabold tracking-tight">Kadence</span>
        <nav className="ml-6 hidden gap-5 text-sm font-medium text-neutral-500 md:flex">
          <span>Guitars</span>
          <span>Keys</span>
          <span>Strings</span>
          <span>Percussion</span>
          <span>Stores</span>
        </nav>
        <div className="ml-auto flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-black/5">
          <span className="h-5 w-5 rounded-full shadow" style={sphere} />
          <span className="text-sm font-semibold">Vyme</span>
        </div>
      </header>

      {/* ---------------- Hero ---------------- */}
      <main className="mx-auto max-w-6xl px-5 pb-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pt-6">
          {/* Left: promise + AI bar */}
          <section>
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-200">
              <span className="h-3.5 w-3.5 rounded-full" style={sphere} />
              AI shopping assistant
            </p>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Find your perfect instrument<br className="hidden sm:block" /> in 30 seconds
            </h1>
            <p className="mt-3 max-w-md text-[15px] text-neutral-500">
              Tell Vyme what you play and your budget — get three honest picks, in stock and ready to try in-store.
            </p>

            {/* Inline AI bar (embedded in hero, not a popup) */}
            <div className="mt-6 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 shrink-0 rounded-full shadow" style={sphere} />
                <p className="text-sm font-semibold text-neutral-700">Ask Vyme</p>
                {/* Demo-only audience toggle so both landing states are visible */}
                <div className="ml-auto flex rounded-full bg-neutral-100 p-0.5 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => { setAudience('new'); reset(); }}
                    className={`rounded-full px-2.5 py-1 transition ${audience === 'new' ? 'bg-white text-neutral-800 shadow-sm' : 'text-neutral-400'}`}
                  >
                    New
                  </button>
                  <button
                    type="button"
                    onClick={() => setAudience('returning')}
                    className={`rounded-full px-2.5 py-1 transition ${audience === 'returning' ? 'bg-white text-neutral-800 shadow-sm' : 'text-neutral-400'}`}
                  >
                    Returning
                  </button>
                </div>
              </div>

              {/* Text field */}
              <div className="mt-3 flex items-center gap-2 rounded-full bg-neutral-50 px-3 py-2 ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-orange-300">
                <input
                  placeholder="Ask anything…"
                  aria-label="Ask anything"
                  className="min-w-0 flex-1 bg-transparent text-[15px] placeholder:text-neutral-400 focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Send"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white shadow-sm transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                  style={{ background: 'linear-gradient(135deg, #7B6CF6, #5B4BE0)' }}
                >
                  <SendIcon />
                </button>
              </div>

              {/* State B — returning user: contextual nudge replaces chips */}
              {audience === 'returning' ? (
                <div className="mt-3 flex flex-col gap-2 rounded-2xl bg-orange-50 p-3 ring-1 ring-orange-200 sm:flex-row sm:items-center">
                  <p className="flex-1 text-[14px] font-medium text-orange-800">
                    Time for new strings for your <span className="font-bold">Yamaha F310</span>?
                  </p>
                  <button
                    type="button"
                    className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-white shadow-sm transition hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #D97C4C, #B8532A)' }}
                  >
                    Show strings <ArrowIcon />
                  </button>
                </div>
              ) : (
                /* State A — new user: intent → clarify → results */
                <div className="mt-3">
                  {step === 'intent' && (
                    <ChipRow label="I'm…">
                      {INTENTS.map((c) => (
                        <Chip key={c} onClick={() => { setIntent(c); setStep('instrument'); }}>{c}</Chip>
                      ))}
                    </ChipRow>
                  )}

                  {step === 'instrument' && (
                    <ChipRow label="Which instrument?">
                      {INSTRUMENTS.map((c) => (
                        <Chip key={c} onClick={() => { setInstrument(c); setStep('budget'); }}>{c}</Chip>
                      ))}
                    </ChipRow>
                  )}

                  {step === 'budget' && (
                    <ChipRow label="Your budget?">
                      {BUDGETS.map((c) => (
                        <Chip key={c} onClick={() => setStep('results')}>{c}</Chip>
                      ))}
                    </ChipRow>
                  )}

                  {step === 'results' && (
                    <div className="flex items-center gap-2 text-[13px] text-neutral-500">
                      <span className="h-5 w-5 shrink-0 rounded-full shadow" style={sphere} />
                      <p>
                        Here are three {intent?.toLowerCase()} {instrument?.toLowerCase()} picks within budget.
                      </p>
                      <button onClick={reset} className="ml-auto shrink-0 rounded-full px-2 py-1 text-[12px] font-semibold text-orange-700 hover:bg-orange-50">
                        Start over
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Right: hero visual (reuses sphere + card treatment) */}
          <aside className="hidden lg:block">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#ECE9F2] via-[#F7F1EC] to-[#F3A874] ring-1 ring-black/5">
              <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-2xl" style={sphere} />
              <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/85 p-4 text-center shadow-sm ring-1 ring-black/5 backdrop-blur">
                <p className="text-sm font-semibold text-neutral-700">500+ instruments · 2 experience stores</p>
                <p className="mt-0.5 text-xs text-neutral-500">Bengaluru · Delhi</p>
              </div>
            </div>
          </aside>
        </div>

        {/* ---------------- Recommendation cards ---------------- */}
        {(step === 'results' || audience === 'returning') && (
          <section className="mt-10">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-5 w-5 rounded-full shadow" style={sphere} />
              <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">
                Vyme recommends
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {RECS.map((r) => (
                <RecommendationCard key={r.id} r={r} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Floating Vyme chatbot launcher (desktop corner card / mobile sheet) */}
      <ChatWidget />
    </div>
  );
}

/* ---------------- Shared sub-components ---------------- */

function ChipRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[12px] font-semibold text-neutral-500">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-[40px] items-center rounded-full border border-orange-200 bg-white px-4 text-sm font-semibold text-orange-700 shadow-sm transition hover:bg-orange-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
    >
      {children}
    </button>
  );
}

function RecommendationCard({ r }: { r: Rec }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
      <div
        className="relative h-32"
        style={{ background: `linear-gradient(135deg, ${r.tint}, ${r.tint}99)` }}
      >
        {/* Fallback glyph sits behind; the real photo covers it when it loads.
            If the image fails, onError hides it and the gradient + glyph show. */}
        <span className="absolute inset-0 grid place-items-center text-5xl drop-shadow-sm">
          {r.glyph}
        </span>
        <img
          src={r.image}
          alt={r.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">{r.category}</p>
        <h3 className="mt-0.5 text-[15px] font-bold leading-tight text-neutral-800">{r.name}</h3>

        {/* Why it fits you */}
        <p className="mt-2 flex items-start gap-1.5 text-[13px] leading-snug text-neutral-600">
          <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full shadow" style={sphere} />
          {r.why}
        </p>

        {/* Price + EMI */}
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-[17px] font-extrabold text-neutral-800">{inr(r.price)}</p>
            <p className="text-[11px] text-neutral-400">EMI from {emiFrom(r.price)}</p>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              r.stock === 'In stock'
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
            }`}
          >
            <PinIcon /> {r.stock} · {r.store}
          </span>
        </div>

        {/* One primary next step */}
        <button
          type="button"
          className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-full text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          style={{ background: 'linear-gradient(135deg, #7B6CF6, #5B4BE0)' }}
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
