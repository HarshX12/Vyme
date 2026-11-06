'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';

/* ==================================================================== */
/*  Floating Vyme chat widget — a chatbot launcher for any page.         */
/*  - Launcher: the Vyme sphere, fixed bottom-right (desktop + mobile).  */
/*  - Teaser: a rotating tooltip bubble that changes on an interval.     */
/*  - Panel: corner card on desktop, full-screen sheet on mobile.        */
/*  Reuses the Vyme design tokens; posts to /api/chat via useChat.       */
/* ==================================================================== */

const sphere = {
  background:
    'radial-gradient(circle at 32% 28%, #F4C6A2 0%, #D97C4C 45%, #A8441F 100%)',
};

// Teaser rotates every 5 minutes (per spec). Lower this to demo the rotation.
const TEASER_INTERVAL_MS = 5 * 60 * 1000;

const TEASERS = [
  'Need help picking an instrument?',
  'Ask me about guitars, keys & strings',
  'Beginner? I’ll find your first instrument',
  'Mahogany vs Rosewood? I can explain',
  'Shopping for a gift? Let’s find one',
];

const inr = (n: number) => '₹' + n.toLocaleString('en-IN');

/* ----- icons ----- */

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5a8.5 8.5 0 0 1 17 0Z" />
    </svg>
  );
}

/* ----- product cards (from the catalog tool output) ----- */

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  level: string;
  blurb: string;
  tint: string;
  url: string;
};

function ProductGrid({ products }: { products: Product[] }) {
  if (!products?.length) return null;
  return (
    <div className="flex items-start gap-2">
      <span className="mb-1 h-6 w-6 shrink-0 rounded-full shadow" style={sphere} />
      <div className="flex w-full max-w-[85%] flex-col gap-2.5">
        {products.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl bg-white/90 shadow-sm ring-1 ring-black/5">
            <div className="flex h-16 items-center justify-end px-3" style={{ background: `linear-gradient(135deg, ${p.tint}, ${p.tint}99)` }} />
            <div className="p-3">
              <p className="text-[13px] font-bold leading-tight text-neutral-800">{p.name}</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-wide text-neutral-400">{p.category} · {p.level}</p>
              <p className="mt-1.5 text-[12px] leading-snug text-neutral-600">{p.blurb}</p>
              <p className="mt-1.5 text-[13px] font-extrabold text-neutral-800">{inr(p.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----- chat feed pieces ----- */

function Bubble({ text, isUser }: { text: string; isUser: boolean }) {
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <span className="mb-1 h-6 w-6 shrink-0 rounded-full shadow" style={sphere} />}
      <div
        className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-[14px] shadow-sm ${
          isUser ? 'rounded-br-md text-white' : 'rounded-bl-md bg-white/85 text-neutral-800 ring-1 ring-black/5 backdrop-blur'
        }`}
        style={isUser ? { background: 'linear-gradient(135deg, #D97C4C, #B8532A)' } : undefined}
      >
        {text}
      </div>
    </div>
  );
}

function Dot({ delay = '0s' }: { delay?: string }) {
  return <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: delay }} />;
}

/* ==================================================================== */
/*  The chat panel (header + feed + composer)                           */
/* ==================================================================== */

function ChatPanel({ onClose }: { onClose: () => void }) {
  const { messages, sendMessage, status, error, regenerate } = useChat();
  const [input, setInput] = useState('');
  const feedRef = useRef<HTMLDivElement>(null);

  const isBusy = status === 'submitted' || status === 'streaming';
  const isEmpty = messages.length === 0;

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isBusy]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;
    sendMessage({ text: trimmed });
    setInput('');
  }

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden sm:rounded-3xl sm:shadow-2xl sm:ring-1 sm:ring-black/10"
      style={{ background: 'linear-gradient(180deg, #ECE9F2 0%, #F7F1EC 48%, #F3A874 100%)' }}
    >
      {/* Header */}
      <header className="flex items-center gap-2 px-4 pt-4">
        <span className="h-6 w-6 rounded-full shadow" style={sphere} />
        <div>
          <p className="text-[15px] font-extrabold leading-none tracking-tight text-neutral-800">Vyme</p>
          <p className="mt-0.5 text-[10px] font-medium text-neutral-400">Powered by AI</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-white/70 text-neutral-500 backdrop-blur transition hover:bg-white"
        >
          <CloseIcon />
        </button>
      </header>

      {/* Feed */}
      <div ref={feedRef} className="flex-1 overflow-y-auto px-4 pb-3">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="h-16 w-16 rounded-full shadow-lg" style={sphere} />
            <p className="mt-3 text-[15px] font-semibold text-neutral-700">Hi, I’m Vyme.</p>
            <p className="mt-1 max-w-[220px] text-[13px] text-neutral-500">
              Tell me what you play and your budget — I’ll find your match.
            </p>
            <div className="mt-4 flex w-full max-w-[260px] flex-col gap-2">
              <button
                type="button"
                onClick={() => send('I’d like to discover your instruments.')}
                className="min-h-[44px] rounded-full border border-orange-300 bg-orange-50/60 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
              >
                🎵 Discover our Instruments
              </button>
              <button
                type="button"
                onClick={() => send('I need some support with an order.')}
                className="min-h-[44px] rounded-full border border-indigo-200 bg-white text-sm font-semibold text-indigo-500 transition hover:bg-indigo-50"
              >
                Get Support
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pt-3">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div key={m.id} className="flex flex-col gap-3">
                  {(m.parts as any[]).map((part, i) => {
                    if (part.type === 'text') {
                      const text = (part.text ?? '').trim();
                      if (!text) return null;
                      return <Bubble key={`${m.id}-t-${i}`} text={text} isUser={isUser} />;
                    }
                    if (part.type === 'tool-recommendInstruments' && part.state === 'output-available') {
                      const products = (part.output?.products ?? []) as Product[];
                      return <ProductGrid key={`${m.id}-p-${i}`} products={products} />;
                    }
                    return null;
                  })}
                </div>
              );
            })}

            {isBusy && (
              <div className="flex items-end gap-2">
                <span className="mb-1 h-6 w-6 shrink-0 rounded-full shadow" style={sphere} />
                <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white/85 px-4 py-3 shadow-sm ring-1 ring-black/5 backdrop-blur">
                  <Dot /> <Dot delay="0.15s" /> <Dot delay="0.3s" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-end gap-2">
                <span className="mb-1 h-6 w-6 shrink-0 rounded-full shadow" style={sphere} />
                <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-red-50 px-4 py-3 text-[13px] text-red-700 ring-1 ring-red-200">
                  <p className="font-semibold">Could not reach the assistant.</p>
                  {error.message && <p className="mt-0.5 break-words text-[12px] text-red-500">{error.message}</p>}
                  <button
                    type="button"
                    onClick={() => regenerate()}
                    className="mt-2 rounded-full bg-red-600 px-3 py-1 text-[12px] font-semibold text-white transition hover:bg-red-700"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="px-3 pb-4 pt-1"
      >
        <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 shadow-lg ring-1 ring-black/5 backdrop-blur">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message"
            aria-label="Message"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!input.trim() || isBusy}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white shadow-md transition disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #7B6CF6, #5B4BE0)' }}
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  );
}

/* ==================================================================== */
/*  The widget: launcher + teaser + panel                               */
/* ==================================================================== */

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [teaserIdx, setTeaserIdx] = useState(0);
  const [teaserDismissed, setTeaserDismissed] = useState(false);

  // Rotate the teaser message on the interval.
  useEffect(() => {
    const id = setInterval(
      () => setTeaserIdx((i) => (i + 1) % TEASERS.length),
      TEASER_INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Launcher + teaser (visible when the panel is closed) */}
      {!open && (
        <div className="fixed bottom-5 right-5 z-50 flex items-end gap-2 sm:bottom-6 sm:right-6">
          {!teaserDismissed && (
            <div className="relative mb-1 max-w-[220px] rounded-2xl rounded-br-sm bg-white px-3.5 py-2.5 text-[13px] font-medium text-neutral-700 shadow-lg ring-1 ring-black/5">
              {TEASERS[teaserIdx]}
              <button
                type="button"
                onClick={() => setTeaserDismissed(true)}
                aria-label="Dismiss"
                className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-neutral-200 text-[11px] font-bold text-neutral-500 transition hover:bg-neutral-300"
              >
                ×
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Chat with Vyme"
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full shadow-xl ring-2 ring-white transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            style={sphere}
          >
            <ChatIcon />
          </button>
        </div>
      )}

      {/* Panel: full-screen on mobile, corner card on desktop */}
      {open && (
        <div className="fixed inset-0 z-50 sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[600px] sm:max-h-[85vh] sm:w-[380px]">
          <ChatPanel onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
