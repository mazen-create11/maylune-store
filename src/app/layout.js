import './globals.css';

export const metadata = {
  metadataBase: new URL('https://maylune.fr'),
  title: 'MAYLUNE — Le sac que vous composez, crocheté à la commande',
  description:
    'Choisissez la forme, l’accord de couleurs et les détails de votre sac MAYLUNE. Votre composition est crochetée à la commande en 7 à 12 jours.',
  openGraph: {
    title: 'MAYLUNE — Personne ne l’aura choisi à votre place',
    description: 'Quatre formes, quatre accords signature et des détails utiles à choisir pas à pas.',
    images: ['/images/campaign.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
