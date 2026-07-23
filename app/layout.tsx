import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vyme — AI Instrument Advisor',
  description: 'Find the right instrument, powered by AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
