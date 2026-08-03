export const metadata = {
  title: 'Informations légales — MAYLUNE',
  description: 'Informations sur le site de présentation MAYLUNE et son ouverture commerciale.',
  alternates: { canonical: './informations-legales/' },
};

export default function LegalInformation() {
  return (
    <main className="legal-page">
      <header>
        <a href="../" aria-label="Retour à l’accueil MAYLUNE" className="legal-brand">MAYLUNE</a>
        <a href="../#faq" className="text-link">Questions fréquentes</a>
      </header>
      <article>
        <p className="eyebrow">Transparence avant ouverture</p>
        <h1>Informations légales et commerciales</h1>
        <p className="legal-lead">Cette version présente l’univers et le configurateur MAYLUNE. Les commandes et le paiement ne sont pas encore ouverts.</p>

        <section>
          <span>01</span><div><h2>Éditeur et conditions de vente</h2><p>L’identité juridique complète de l’éditeur, son adresse, son immatriculation, ses coordonnées de contact et les conditions générales de vente seront publiées avant l’activation du paiement. Aucun achat ne peut être conclu sur la version actuelle.</p></div>
        </section>
        <section>
          <span>02</span><div><h2>Personnalisation, délais et retours</h2><p>Les prix et délais visibles sont des indications de lancement. Les caractéristiques vérifiées de chaque modèle, les destinations de livraison, les frais, le droit applicable et les règles propres aux pièces personnalisées seront confirmés dans le récapitulatif et les conditions de vente avant toute commande.</p></div>
        </section>
        <section>
          <span>03</span><div><h2>Données et panier</h2><p>Le configurateur conserve uniquement votre composition dans le stockage local de votre navigateur. Dans cette version, aucun formulaire de contact, compte client, outil publicitaire ou paiement n’est actif. La politique de confidentialité sera complétée avant l’ajout de ces services.</p></div>
        </section>
        <section>
          <span>04</span><div><h2>Hébergement</h2><p>Le prototype public est hébergé par GitHub Pages. Le domaine définitif et les coordonnées de la marque seront ajoutés lors de l’ouverture commerciale.</p></div>
        </section>
        <a href="../#config-start" className="button button-dark">Revenir au configurateur</a>
      </article>
    </main>
  );
}
