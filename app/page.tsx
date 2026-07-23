'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Inline icons (kept dependency-free — no icon library required)     */
/* ------------------------------------------------------------------ */

function PaperclipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.44 11.05-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0M12 17v5" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5 12h14" />
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

function HeadsetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <path d="M18 19a2 2 0 0 1-2 2h-2M4 14h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Zm16 0h-2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared style tokens                                                 */
/* ------------------------------------------------------------------ */

const sphere = {
  background:
    'radial-gradient(circle at 32% 28%, #F4C6A2 0%, #D97C4C 45%, #A8441F 100%)',
};

const categories = [
  { label: 'Guitars', glyph: '🎸' },
  { label: 'Violins', glyph: '🎻' },
  { label: 'Mandolins', glyph: '🪕' },
  { label: 'Digital Pianos', glyph: '🎹' },
  { label: 'Saxophones', glyph: '🎷' },
];

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function Page() {
  // v5 useChat: no managed input state — we own it and call sendMessage.
  // With no options, it POSTs to /api/chat (matches your route.ts).
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');
  const feedRef = useRef<HTMLDivElement>(null);

  const isBusy = status === 'submitted' || status === 'streaming';
  const isEmpty = messages.length === 0;

  // Auto-scroll the feed as messages stream in.
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
    <div className="flex min-h-screen justify-center bg-neutral-100 p-0 sm:p-6">
      {/* Phone-style column with the Vyme gradient */}
      <div
        className="relative flex h-screen w-full max-w-md flex-col overflow-hidden sm:h-[860px] sm:rounded-[28px] sm:shadow-2xl"
        style={{
          background:
            'linear-gradient(180deg, #ECE9F2 0%, #F7F1EC 48%, #F3A874 100%)',
        }}
      >
        {/* ---------------- Header ---------------- */}
        <header className="flex items-center gap-2 px-5 pt-5">
          <span className="mr-1 select-none text-lg leading-none tracking-tighter text-neutral-400">
            ⠿
          </span>
          <span className="h-5 w-5 rounded-full shadow" style={sphere} />
          <span className="text-lg font-extrabold tracking-tight text-neutral-800">
            Vyme
          </span>
          <div className="ml-auto flex items-center gap-2 text-neutral-500">
            <button
              type="button"
              aria-label="Minimize"
              className="grid h-8 w-8 place-items-center rounded-full bg-white/70 backdrop-blur transition hover:bg-white"
            >
              <MinimizeIcon />
            </button>
            <button
              type="button"
              aria-label="Close"
              className="grid h-8 w-8 place-items-center rounded-full bg-white/70 backdrop-blur transition hover:bg-white"
            >
              <CloseIcon />
            </button>
          </div>
        </header>

        {/* ---------------- Scrollable body ---------------- */}
        <div ref={feedRef} className="flex-1 overflow-y-auto px-5 pb-4">
          {isEmpty ? <Welcome onPick={send} /> : <Feed messages={messages} busy={isBusy} />}
        </div>

        {/* ---------------- Composer ---------------- */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="px-4 pb-5 pt-2"
        >
          <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 shadow-lg ring-1 ring-black/5 backdrop-blur">
            <button type="button" aria-label="Attach" className="grid h-8 w-8 place-items-center rounded-full text-neutral-400 transition hover:text-neutral-600">
              <PaperclipIcon />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message"
              className="min-w-0 flex-1 bg-transparent text-[15px] text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
            />
            <button type="button" aria-label="Voice input" className="grid h-8 w-8 place-items-center rounded-full text-neutral-400 transition hover:text-neutral-600">
              <MicIcon />
            </button>
            <button
              type="submit"
              aria-label="Send"
              disabled={!input.trim() || isBusy}
              className="grid h-9 w-9 place-items-center rounded-full text-white shadow-md transition disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #7B6CF6, #5B4BE0)' }}
            >
              <SendIcon />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty / hero state                                                  */
/* ------------------------------------------------------------------ */

function Welcome({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex flex-col items-center pt-6 text-center">
      <div className="h-24 w-24 rounded-full shadow-xl" style={sphere} />
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-neutral-800">Vyme</h1>
      <p className="text-xs font-medium text-neutral-400">Powered by AI</p>

      <p className="mt-6 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Today</p>

      {/* Greeting + quick actions */}
      <div className="mt-4 w-full rounded-3xl bg-white/80 p-5 text-left shadow-sm ring-1 ring-black/5 backdrop-blur">
        <p className="text-[15px] font-medium text-neutral-700">
          Hey there!!! Lets vibe with Vyme.<br />how can i help you today?
        </p>

        <button
          type="button"
          onClick={() => onPick("I'd like to discover your instruments.")}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-orange-300 bg-orange-50/60 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
        >
          🎵 Discover our Instruments
        </button>

        <p className="my-2 text-center text-xs font-medium text-neutral-400">Or</p>

        <button
          type="button"
          onClick={() => onPick('I need some support with an order.')}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-indigo-200 bg-white py-3 text-sm font-semibold text-indigo-500 transition hover:bg-indigo-50"
        >
          <HeadsetIcon /> Get Support
        </button>
      </div>

      {/* Category chips */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => onPick(`I'm interested in ${c.label.toLowerCase()}.`)}
            className="rounded-full border border-orange-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-orange-700 shadow-sm transition hover:bg-white"
          >
            <span className="mr-1">{c.glyph}</span>
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chat feed                                                           */
/* ------------------------------------------------------------------ */

type UiMessage = ReturnType<typeof useChat>['messages'][number];

function messageText(m: UiMessage) {
  return m.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

function Feed({ messages, busy }: { messages: UiMessage[]; busy: boolean }) {
  return (
    <div className="flex flex-col gap-3 pt-4">
      <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Today</p>

      {messages.map((m) => {
        const text = messageText(m);
        if (!text) return null;
        const isUser = m.role === 'user';

        return (
          <div key={m.id} className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && <span className="mb-1 h-6 w-6 shrink-0 rounded-full shadow" style={sphere} />}
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[15px] shadow-sm ${
                isUser
                  ? 'rounded-br-md text-white'
                  : 'rounded-bl-md bg-white/85 text-neutral-800 ring-1 ring-black/5 backdrop-blur'
              }`}
              style={isUser ? { background: 'linear-gradient(135deg, #D97C4C, #B8532A)' } : undefined}
            >
              {text}
            </div>
          </div>
        );
      })}

      {busy && (
        <div className="flex items-end gap-2">
          <span className="mb-1 h-6 w-6 shrink-0 rounded-full shadow" style={sphere} />
          <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white/85 px-4 py-3 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <Dot /> <Dot delay="0.15s" /> <Dot delay="0.3s" />
          </div>
        </div>
      )}
    </div>
  );
}

function Dot({ delay = '0s' }: { delay?: string }) {
  return (
    <span
      className="h-2 w-2 animate-bounce rounded-full bg-neutral-400"
      style={{ animationDelay: delay }}
    />
  );
}
