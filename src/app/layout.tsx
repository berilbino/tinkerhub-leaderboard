import type { Metadata } from 'next';
import { Bowlby_One_SC, DM_Sans } from 'next/font/google';
import './globals.css';

const bowlbyOneSC = Bowlby_One_SC({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bowlby',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TinkerHub Leaderboard',
  description: 'A playful retro leaderboard platform for TinkerHub study jams, creative programs, and competitions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bowlbyOneSC.variable} ${dmSans.variable} font-sans bg-white text-[#111111] antialiased`}
    >
      <body className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#FFD43B] selection:text-[#111111]">
        {children}
      </body>
    </html>
  );
}
