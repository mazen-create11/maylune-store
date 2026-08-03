import './globals.css';
import { siteUrl } from '../lib/site';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'MAYLUNE — Le sac que vous composez, crocheté à la commande',
  description:
    'Choisissez la forme, l’accord de couleurs et les détails de votre sac MAYLUNE. Votre composition est crochetée à la commande en 7 à 12 jours.',
  alternates: { canonical: './' },
  openGraph: {
    title: 'MAYLUNE — Personne ne l’aura choisi à votre place',
    description: 'Quatre formes, quatre accords signature et des détails utiles à choisir pas à pas.',
    url: './',
    siteName: 'MAYLUNE',
    locale: 'fr_FR',
    type: 'website',
    images: ['/images/campaign.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAYLUNE — Votre style mérite mieux qu’un sac déjà vu',
    description: 'Composez votre forme, votre accord de couleurs et vos détails.',
    images: ['/images/campaign.webp'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
