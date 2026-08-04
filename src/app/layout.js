import './globals.css';
import localFont from 'next/font/local';
import { siteUrl } from '../lib/site';

const fraunces = localFont({
  src: [
    { path: './fonts/fraunces-variable.ttf', weight: '100 900', style: 'normal' },
    { path: './fonts/fraunces-italic-variable.ttf', weight: '100 900', style: 'italic' },
  ],
  variable: '--font-fraunces',
  display: 'swap',
});

const manrope = localFont({
  src: './fonts/manrope-variable.ttf',
  variable: '--font-manrope',
  display: 'swap',
  weight: '200 800',
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'MAYLUNE · Vos couleurs, votre sac crocheté à la commande',
  description:
    'Composez votre sac au crochet : une forme, 1 à 4 couleurs parmi 16 coloris, vos initiales. Crocheté à la commande en 7 à 12 jours, dès 49 €.',
  alternates: { canonical: './' },
  openGraph: {
    title: 'MAYLUNE · Vos couleurs, votre sac',
    description: 'Une forme, jusqu’à quatre couleurs, vos initiales. Crocheté à la commande dès 49 €.',
    url: './',
    siteName: 'MAYLUNE',
    locale: 'fr_FR',
    type: 'website',
    images: ['/images/campaign.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAYLUNE · Vos couleurs, votre sac',
    description: 'Composez la forme, la recette de couleurs et les finitions. Crocheté à la commande.',
    images: ['/images/campaign.webp'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${fraunces.variable} ${manrope.variable}`}>{children}</body>
    </html>
  );
}
