'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const products = [
  {
    id: 'rosalie',
    name: 'Rosalie',
    type: 'Mini bandoulière',
    price: 59,
    image: '/images/rosalie.png',
    alt: 'Sac Rosalie MAYLUNE framboise et bordeaux avec chaîne dorée',
    badge: 'Bestseller',
    usage: 'Pour sortir légère',
    capacity: 'Téléphone · cartes · rouge à lèvres',
  },
  {
    id: 'capri',
    name: 'Capri',
    type: 'Sac épaule souple',
    price: 74,
    image: '/images/capri.png',
    alt: 'Sac Capri MAYLUNE bleu cobalt crocheté à la main',
    badge: 'Signature',
    usage: 'Pour tous les jours',
    capacity: 'Portefeuille · clés · lunettes · carnet',
  },
  {
    id: 'colette',
    name: 'Colette',
    type: 'Cabas quotidien',
    price: 109,
    image: '/images/colette.png',
    alt: 'Cabas Colette MAYLUNE jaune beurre et écru',
    badge: 'Grande capacité',
    usage: 'Pour les journées pleines',
    capacity: 'Tablette · trousse · bouteille',
  },
  {
    id: 'mini-muse',
    name: 'Mini Muse',
    type: 'Mini sac épaule',
    price: 55,
    image: '/images/hero-maylune.png',
    alt: 'Mini Muse MAYLUNE rouge tomate et vanille porté au soleil',
    badge: 'Petit format',
    usage: 'Pour le soir',
    capacity: 'Téléphone · cartes · écouteurs',
  },
];

const palettes = [
  {
    name: 'Dolce Vita',
    colors: ['#df4b36', '#e9c46b'],
    label: 'Tomate & vanille',
    image: '/images/palette-dolce-vita.png',
    mood: 'Solaire',
    benefit: 'Réchauffe le blanc, le denim et le camel.',
  },
  {
    name: 'French Kiss',
    colors: ['#d72e69', '#6d1729'],
    label: 'Framboise & bordeaux',
    image: '/images/palette-french-kiss.png',
    mood: 'Intense',
    benefit: 'Relève le noir, le gris et le jean brut.',
  },
  {
    name: 'Riviera',
    colors: ['#1948c8', '#eee7dc'],
    label: 'Cobalt & écru',
    image: '/images/capri.png',
    mood: 'Franc',
    benefit: 'Éclaire les neutres, le marine et les rayures.',
  },
  {
    name: 'Pistache',
    colors: ['#b7c692', '#e4b8c3'],
    label: 'Pistache & rose poudré',
    image: '/images/palette-pistache.png',
    mood: 'Doux',
    benefit: 'Adoucit l’écru, le beige et le chocolat.',
  },
];

const finishes = [
  {
    id: 'braid',
    name: 'Anse crochetée',
    short: 'Souple et ton sur ton',
    benefit: 'Un porté confortable, réalisé dans les mêmes fils que votre sac.',
    price: 0,
    image: '/images/capri.png',
    position: '50% 13%',
  },
  {
    id: 'chain',
    name: 'Chaîne dorée',
    short: 'Amovible, plus habillée',
    benefit: 'Transforme le sac de journée en sac du soir, sans changer de modèle.',
    price: 8,
    image: '/images/rosalie.png',
    position: '50% 72%',
  },
  {
    id: 'pocket',
    name: 'Poche zippée',
    short: 'Doublée à l’intérieur',
    benefit: 'Garde les clés, les cartes et les écouteurs faciles à retrouver.',
    price: 10,
    image: '/images/detail-pocket.png',
    position: 'center',
  },
];

const faqs = [
  {
    q: 'Quand vais-je recevoir ma création ?',
    a: 'Prévoyez 7 à 12 jours ouvrés pour la confection, puis 2 à 4 jours pour la livraison en France métropolitaine. Vous recevez un e-mail au démarrage de l’atelier, puis le suivi du colis.',
  },
  {
    q: 'Comment être sûre de mon association de couleurs ?',
    a: 'Le configurateur vous donne une direction visuelle. Avant de commencer une composition personnalisée, l’atelier peut confirmer l’accord avec une photo des fils côte à côte.',
  },
  {
    q: 'Que puis-je réellement personnaliser ?',
    a: 'La silhouette, l’accord de couleurs, le type d’anse, la chaîne, la poche intérieure et jusqu’à trois initiales sur la plaque. Le prix se met à jour à chaque ajout.',
  },
  {
    q: 'Le sac garde-t-il sa forme ?',
    a: 'Le fil et le point sont choisis pour donner de la tenue sans rendre le sac rigide. La doublure et les finitions renforcent les zones les plus sollicitées.',
  },
  {
    q: 'Puis-je retourner un sac personnalisé ?',
    a: 'Une création réalisée selon vos choix ne peut pas être remise en vente. Si elle présente un défaut ou ne correspond pas à la composition validée, contactez l’atelier avec des photos pour une solution adaptée.',
  },
  {
    q: 'Puis-je modifier ma commande ?',
    a: 'Écrivez-nous dans les 12 heures. Tant que la confection n’a pas commencé, la palette ou les finitions peuvent encore être ajustées.',
  },
  {
    q: 'Comment entretenir le crochet ?',
    a: 'Nettoyez localement avec un linge humide et un savon doux, sans frotter. Laissez sécher à plat, loin d’une source de chaleur. Évitez la machine et le sèche-linge.',
  },
  {
    q: 'Livrez-vous hors de France ?',
    a: 'Oui. Les destinations, délais et frais disponibles sont indiqués au moment du paiement selon votre adresse.',
  },
];

const steps = ['La forme', 'Les couleurs', 'Les détails', 'La plaque'];

function ArrowIcon({ direction = 'right' }) {
  return (
    <svg className={direction === 'left' ? 'flip' : ''} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

function BagIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>;
}

function MenuIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16" /></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

function CheckIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>;
}

function Brand({ light = false }) {
  return (
    <span className={`brand ${light ? 'brand-light' : ''}`} aria-label="MAYLUNE">
      <svg className="brand-mark" viewBox="0 0 42 42" aria-hidden="true"><path d="M8 31V10l13 18 13-18v21" /><path d="M6 33c8 4 22 4 30 0" /></svg>
      <span>MAYLUNE</span>
    </span>
  );
}

function PaymentLogos({ light = false }) {
  const methods = [
    ['Visa', '/payments/visa.svg', 50],
    ['Mastercard', '/payments/mastercard.svg', 39],
    ['PayPal', '/payments/paypal.svg', 42],
    ['Apple Pay', '/payments/applepay.svg', 54],
    ['Klarna', '/payments/klarna.svg', 42],
  ];
  return (
    <div className={`payment-logos ${light ? 'light' : ''}`} aria-label="Moyens de paiement acceptés">
      {methods.map(([name, src, width]) => <Image key={name} src={src} alt={name} width={width} height={24} />)}
    </div>
  );
}

function ProductCard({ product, onChoose }) {
  return (
    <article className="product-card reveal">
      <div className="product-media">
        <Image src={product.image} alt={product.alt} fill sizes="(max-width: 760px) 82vw, 25vw" />
        <span className="product-badge">{product.badge}</span>
        <button type="button" className="product-choose" onClick={() => onChoose(product)}>Partir de cette forme <ArrowIcon /></button>
      </div>
      <div className="product-heading"><div><span>{product.type}</span><h3>{product.name}</h3></div><strong>Dès {product.price} €</strong></div>
      <p className="product-usage">{product.usage}</p>
      <p className="product-capacity">{product.capacity}</p>
    </article>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(products[1]);
  const [palette, setPalette] = useState(palettes[2]);
  const [selectedFinishes, setSelectedFinishes] = useState(['braid']);
  const [initials, setInitials] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [notice, setNotice] = useState('');
  const [focus, setFocus] = useState({
    type: 'Silhouette',
    title: products[1].name,
    copy: products[1].capacity,
    image: products[1].image,
    position: 'center',
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.1 },
    );
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('locked', menuOpen || cartOpen);
    return () => document.body.classList.remove('locked');
  }, [menuOpen, cartOpen]);

  const total = useMemo(() => {
    const options = finishes
      .filter((finish) => selectedFinishes.includes(finish.id))
      .reduce((sum, finish) => sum + finish.price, 0);
    return selectedProduct.price + options + (initials ? 8 : 0);
  }, [initials, selectedFinishes, selectedProduct]);

  const selectedDetails = finishes.filter((finish) => selectedFinishes.includes(finish.id)).map((finish) => finish.name);
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const configuredPreviewImage = selectedProduct.id === 'capri' ? palette.image : selectedProduct.image;

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2400);
  }

  function addToCart(item) {
    setCart((current) => [...current, item]);
    setCartOpen(true);
    showNotice(`${item.name} a été ajouté au panier`);
  }

  function addConfiguredBag() {
    addToCart({
      id: `${selectedProduct.id}-${crypto.randomUUID()}`,
      name: `${selectedProduct.name} personnalisé`,
      price: total,
      image: selectedProduct.image,
      details: `${palette.name} · ${selectedDetails.join(', ')}${initials ? ` · ${initials}` : ''}`,
    });
  }

  function selectProduct(product, scroll = false) {
    setSelectedProduct(product);
    setFocus({ type: 'Silhouette', title: product.name, copy: `${product.usage} · ${product.capacity}`, image: product.image, position: 'center' });
    if (scroll) {
      setActiveStep(0);
      window.setTimeout(() => document.querySelector('#personnaliser')?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }

  function selectPalette(option) {
    setPalette(option);
    setFocus({ type: 'Palette', title: option.name, copy: option.benefit, image: option.image, position: 'center' });
  }

  function toggleFinish(finish) {
    setFocus({ type: 'Détail', title: finish.name, copy: finish.benefit, image: finish.image, position: finish.position });
    if (finish.id === 'braid') return;
    setSelectedFinishes((current) => current.includes(finish.id) ? current.filter((id) => id !== finish.id) : [...current, finish.id]);
  }

  function updateInitials(value) {
    const cleanValue = value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
    setInitials(cleanValue);
    setFocus({
      type: 'Gravure',
      title: cleanValue || 'Vos initiales',
      copy: cleanValue ? `${cleanValue} sera gravé sur la plaque dorée.` : 'Jusqu’à trois lettres sur votre plaque dorée.',
      image: '/images/rosalie.png',
      position: '54% 64%',
    });
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <a className="skip-link" href="#content">Aller au contenu</a>

      <div className="announcement">
        <span>Livraison offerte dès 79 €</span><i />
        <span>Confection à la commande · 7 à 12 jours</span>
      </div>

      <header className="site-header">
        <button type="button" className="icon-button mobile-only" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu"><MenuIcon /></button>
        <nav className="desktop-nav" aria-label="Navigation principale">
          <a href="#collection">Les silhouettes</a><a href="#personnaliser">Composer</a><a href="#savoir-faire">Le geste</a>
        </nav>
        <a href="#content" className="logo-link"><Brand /></a>
        <div className="header-actions"><a className="desktop-link" href="#faq">FAQ</a><button type="button" className="cart-button" onClick={() => setCartOpen(true)}><BagIcon /><span>Panier</span><b>{cart.length}</b></button></div>
      </header>

      <aside className={`drawer menu-drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="drawer-head"><Brand /><button type="button" className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu"><CloseIcon /></button></div>
        <nav>{['Les silhouettes', 'Composer mon sac', 'Le savoir-faire', 'FAQ'].map((item, index) => <a key={item} href={['#collection', '#personnaliser', '#savoir-faire', '#faq'][index]} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{item}<ArrowIcon /></a>)}</nav>
        <p>Une question ? <a href="mailto:bonjour@maylune.fr">bonjour@maylune.fr</a></p>
      </aside>

      <aside className={`drawer cart-drawer ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen}>
        <div className="drawer-head"><div><span className="micro-label">Votre sélection</span><h2>Le panier</h2></div><button type="button" className="icon-button" onClick={() => setCartOpen(false)} aria-label="Fermer le panier"><CloseIcon /></button></div>
        {cart.length === 0 ? <div className="empty-cart"><BagIcon /><h3>Commencez par une forme.</h3><p>Puis choisissez ce qui la rendra vraiment vôtre.</p><a className="button button-dark" href="#collection" onClick={() => setCartOpen(false)}>Voir les silhouettes</a></div> : <>
          <div className="cart-items">{cart.map((item, index) => <article className="cart-item" key={`${item.id}-${index}`}><div className="cart-thumb"><Image src={item.image} alt="" fill sizes="88px" /></div><div><h3>{item.name}</h3><p>{item.details}</p><strong>{item.price} €</strong></div><button type="button" onClick={() => setCart((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Retirer ${item.name}`}>×</button></article>)}</div>
          <div className="cart-footer"><div><span>Sous-total</span><strong>{cartTotal} €</strong></div><p>Livraison calculée avant le paiement.</p><button type="button" className="button button-accent">Passer au paiement <ArrowIcon /></button><div className="secure-copy"><CheckIcon /> Paiement chiffré et sécurisé</div><PaymentLogos /></div>
        </>}
      </aside>
      <button type="button" className={`drawer-overlay ${menuOpen || cartOpen ? 'show' : ''}`} onClick={() => { setMenuOpen(false); setCartOpen(false); }} aria-label="Fermer" />
      <div className={`toast ${notice ? 'show' : ''}`} role="status"><CheckIcon />{notice}</div>

      <section className="hero" id="content">
        <div className="hero-copy">
          <p className="eyebrow">Sacs au crochet · composés par vous</p>
          <h1>Le sac que personne n’aura choisi <em>à votre place.</em></h1>
          <p className="hero-lead">Choisissez une silhouette, mariez deux couleurs et ajoutez les détails qui vous servent vraiment. Nous crochetons votre composition à la commande.</p>
          <div className="hero-actions"><a className="button button-accent" href="#personnaliser">Créer ma signature <ArrowIcon /></a><a className="text-link" href="#collection">Voir les quatre formes</a></div>
          <ul className="hero-facts"><li><b>Dès 55 €</b><span>prix mis à jour en direct</span></li><li><b>7–12 jours</b><span>de confection estimée</span></li><li><b>4 décisions</b><span>guidées pas à pas</span></li></ul>
        </div>
        <figure className="hero-visual">
          <Image src="/images/hero-maylune.png" alt="Mini sac MAYLUNE rouge tomate et vanille porté avec une tenue en lin" fill priority sizes="(max-width: 800px) 100vw, 55vw" />
          <figcaption><span>Mini Muse</span><strong>Dolce Vita</strong></figcaption>
          <div className="hero-seal"><span>M</span><small>Composé<br />pour vous</small></div>
        </figure>
      </section>

      <section className="proof-rail" aria-label="Les engagements MAYLUNE"><div><span>01</span><p><b>Votre accord de couleurs</b> visible avant la confection</p></div><div><span>02</span><p><b>Votre prix</b> calculé sans surprise</p></div><div><span>03</span><p><b>Votre pièce</b> créée à la commande</p></div></section>

      <section className="collection section" id="collection">
        <div className="section-heading reveal"><div><p className="eyebrow">01 · Trouver le bon format</p><h2>Commencez par ce que votre sac doit faire <em>pour vous.</em></h2></div><p>Un mini pour sortir, une forme souple au quotidien ou un cabas qui suit toute la journée. Le style vient ensuite.</p></div>
        <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} onChoose={(item) => selectProduct(item, true)} />)}</div>
      </section>

      <section className="campaign-band reveal">
        <Image src="/images/campaign.png" alt="Trois femmes portant des sacs MAYLUNE colorés au bord de la Méditerranée" fill sizes="100vw" />
        <div className="campaign-overlay"><p className="eyebrow">Une couleur suffit parfois</p><h2>Le détail qui change toute la tenue.</h2><p>Sur un jean, un ensemble neutre ou une robe noire : votre composition devient le point d’attention, pas un accessoire de plus.</p><a className="button button-light" href="#personnaliser">Trouver mon accord <ArrowIcon /></a></div>
      </section>

      <section className="configurator section" id="personnaliser">
        <div className="config-intro reveal"><div><p className="eyebrow">02 · L’atelier de composition</p><h2>Votre sac. Quatre décisions. <em>Zéro hasard.</em></h2></div><p>Chaque choix est montré, expliqué et ajouté au prix en direct. Vous savez ce que vous choisissez et pourquoi.</p></div>

        <div className="config-shell reveal">
          <div className="config-visual">
            <figure className="main-preview">
              <Image src={configuredPreviewImage} alt={`Composition ${selectedProduct.name}, palette ${palette.name}`} fill sizes="(max-width: 900px) 100vw, 48vw" />
              <div className="palette-edge" style={{ '--c1': palette.colors[0], '--c2': palette.colors[1] }} />
              <figcaption><div><span>Votre base</span><strong>{selectedProduct.name}</strong></div><div><span>Votre accord</span><strong>{palette.name}</strong></div></figcaption>
            </figure>
            <figure className="detail-preview" key={`${focus.type}-${focus.title}`}>
              <Image src={focus.image} alt={`Aperçu ${focus.title}`} fill sizes="(max-width: 900px) 86vw, 20vw" style={{ objectPosition: focus.position }} />
              <figcaption><span>{focus.type}</span><strong>{focus.title}</strong><p>{focus.copy}</p></figcaption>
            </figure>
            <p className="preview-note"><CheckIcon /> Aperçu d’inspiration · validation des fils avant confection</p>
          </div>

          <div className="config-panel">
            <div className="config-top">
              <div className="config-top-main"><span>Votre composition</span><strong>{selectedProduct.name} · {palette.name}</strong><small>{selectedDetails.join(' · ')}{initials ? ` · Initiales ${initials}` : ''}</small></div>
              <div className="config-top-price"><b>{total} €</b>{total > selectedProduct.price && <small>{selectedProduct.name} {selectedProduct.price} € + options {total - selectedProduct.price} €</small>}</div>
            </div>
            <nav className="stepper" aria-label="Étapes de personnalisation">{steps.map((step, index) => <button type="button" key={step} className={`${index === activeStep ? 'active' : ''} ${index < activeStep ? 'done' : ''}`} onClick={() => setActiveStep(index)}><span>{index < activeStep ? <CheckIcon /> : `0${index + 1}`}</span><b>{step}</b></button>)}</nav>

            <div className="step-content">
              {activeStep === 0 && <section className="choice-step"><header><span>Étape 1 sur 4</span><h3>Quel rythme aura votre sac ?</h3><p>Choisissez selon ce que vous emportez, pas seulement selon la photo.</p></header><div className="shape-options">{products.map((product) => <button type="button" key={product.id} className={selectedProduct.id === product.id ? 'selected' : ''} onClick={() => selectProduct(product)}><span className="choice-photo"><Image src={product.image} alt="" fill sizes="96px" /></span><span className="choice-copy"><b>{product.name}</b><small>{product.usage}</small><em>{product.capacity}</em></span><strong>{product.price} €</strong>{selectedProduct.id === product.id && <i><CheckIcon /></i>}</button>)}</div></section>}

              {activeStep === 1 && <section className="choice-step"><header><span>Étape 2 sur 4</span><h3>Quel accord réveillera vos tenues ?</h3><p>Quatre palettes pensées pour être faciles à porter, jamais sages.</p></header><div className="palette-cards">{palettes.map((option) => <button type="button" key={option.name} className={palette.name === option.name ? 'selected' : ''} onClick={() => selectPalette(option)}><span className="palette-photo"><Image src={option.image} alt="" fill sizes="180px" /></span><span className="palette-card-copy"><span className="duo-swatch" style={{ '--c1': option.colors[0], '--c2': option.colors[1] }} /><small>{option.mood}</small><b>{option.name}</b><em>{option.label}</em><p>{option.benefit}</p></span>{palette.name === option.name && <i><CheckIcon /></i>}</button>)}</div></section>}

              {activeStep === 2 && <section className="choice-step"><header><span>Étape 3 sur 4</span><h3>Quels détails vous seront vraiment utiles ?</h3><p>Chaque option montre son rendu et son intérêt avant d’être ajoutée.</p></header><div className="finish-cards">{finishes.map((finish) => { const selected = selectedFinishes.includes(finish.id); return <button type="button" key={finish.id} className={selected ? 'selected' : ''} onClick={() => toggleFinish(finish)} aria-pressed={selected}><span className="finish-photo"><Image src={finish.image} alt="" fill sizes="180px" style={{ objectPosition: finish.position }} /></span><span className="finish-card-copy"><b>{finish.name}</b><small>{finish.short}</small><p>{finish.benefit}</p><strong>{finish.price ? `+${finish.price} €` : 'Inclus'}</strong></span><i>{selected ? <CheckIcon /> : '+'}</i></button>; })}</div></section>}

              {activeStep === 3 && <section className="choice-step monogram-step"><header><span>Étape 4 sur 4</span><h3>À qui appartient cette pièce ?</h3><p>Ajoutez jusqu’à trois lettres sur la plaque dorée. Cette option reste facultative.</p></header><div className="monogram-layout"><div className="monogram-photo"><Image src="/images/rosalie.png" alt="Plaque dorée MAYLUNE sur le sac Rosalie" fill sizes="240px" /></div><div className="monogram-control"><span className="gold-plaque">{initials || 'ML'}</span><label htmlFor="initials">Vos initiales <small>+8 €</small></label><div><input id="initials" value={initials} onChange={(event) => updateInitials(event.target.value)} placeholder="Ex. AL" maxLength={3} /><span>{initials.length}/3</span></div><p>La position et la taille restent identiques à la plaque présentée.</p></div></div></section>}
            </div>

            <div className="config-footer">
              <div className="config-recap"><span>Votre composition</span><p>{selectedProduct.name} · {palette.name} · {selectedDetails.length} finition{selectedDetails.length > 1 ? 's' : ''}{initials ? ` · ${initials}` : ''}</p></div>
              <div className="config-actions">{activeStep > 0 && <button type="button" className="back-button" onClick={() => setActiveStep((step) => step - 1)}><ArrowIcon direction="left" /> Retour</button>}<button type="button" className="button button-accent" onClick={() => activeStep < 3 ? setActiveStep((step) => step + 1) : addConfiguredBag()}>{activeStep < 3 ? `Continuer · ${steps[activeStep + 1]}` : 'Ajouter au panier'} <ArrowIcon /></button></div>
              <div className="config-pay"><span>Prix final : <strong>{total} €</strong></span><PaymentLogos /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="value-story section">
        <div className="value-image reveal"><Image src="/images/evening.png" alt="Sac MAYLUNE chocolat et framboise porté le soir" fill sizes="(max-width: 800px) 100vw, 52vw" /><span>Du matin au soir</span></div>
        <div className="value-copy reveal"><p className="eyebrow">Ce que vous achetez vraiment</p><h2>Une pièce qui donne une direction à votre tenue.</h2><p>Vous ne cherchez plus le sac qui ira « à peu près ». Vous partez de vos vêtements, de vos habitudes et des couleurs qui vous attirent déjà.</p><ol><li><span>01</span><div><h3>Il réveille vos basiques</h3><p>Un accord bien choisi suffit à transformer un jean, un trench ou une robe noire.</p></div></li><li><span>02</span><div><h3>Il ne ressemble pas à une série</h3><p>La forme est MAYLUNE. L’association, les détails et la plaque sont les vôtres.</p></div></li><li><span>03</span><div><h3>Il suit votre vraie journée</h3><p>Le format et les finitions partent de ce que vous emportez et de la façon dont vous le portez.</p></div></li></ol><a className="text-link" href="#personnaliser">Reprendre ma composition <ArrowIcon /></a></div>
      </section>

      <section className="craft" id="savoir-faire">
        <div className="craft-image reveal"><Image src="/images/atelier.png" alt="Artisane crochetant un sac MAYLUNE bleu" fill sizes="(max-width: 800px) 100vw, 50vw" /><div><span>Le geste MAYLUNE</span><strong>Maille après maille</strong></div></div>
        <div className="craft-copy reveal"><p className="eyebrow">Fait à la commande</p><h2>Votre composition lance le geste.</h2><p className="craft-lead">La fabrication ne commence qu’après vos choix. La forme, les fils et les finitions sont préparés pour une seule pièce : la vôtre.</p><ol><li><span>01</span><div><h3>La composition est vérifiée</h3><p>Forme, accord de couleurs et options sont réunis sur une fiche d’atelier.</p></div></li><li><span>02</span><div><h3>Le sac prend forme</h3><p>Le corps, les anses et la doublure sont assemblés puis contrôlés.</p></div></li><li><span>03</span><div><h3>Les finitions sont posées</h3><p>Plaque, chaîne et poche sont vérifiées avant la mise en écrin.</p></div></li></ol><div className="craft-fact"><strong>7–12 jours</strong><span>Estimation de confection avant expédition</span></div></div>
      </section>

      <section className="ritual section">
        <div className="ritual-copy reveal"><p className="eyebrow">L’arrivée</p><h2>Le premier porté commence avant d’ouvrir la boîte.</h2><p>Votre sac arrive protégé dans son écrin, avec sa composition et ses conseils d’entretien. Pas un colis anonyme : le dernier chapitre de ce que vous avez choisi.</p><a className="button button-dark" href="#personnaliser">Composer le mien <ArrowIcon /></a></div>
        <figure className="ritual-main reveal"><Image src="/images/unboxing.png" alt="Ouverture de l’écrin bleu MAYLUNE" fill sizes="(max-width: 800px) 100vw, 48vw" /><figcaption>Écrin MAYLUNE · inclus</figcaption></figure>
        <figure className="ritual-detail reveal"><Image src="/images/rosalie.png" alt="Détail du sac Rosalie framboise MAYLUNE" fill sizes="(max-width: 800px) 70vw, 24vw" /><figcaption>Votre accord · votre plaque</figcaption></figure>
      </section>

      <section className="faq section" id="faq">
        <div className="faq-intro reveal"><p className="eyebrow">Avant de choisir</p><h2>Tout ce qu’il faut savoir, sans petites lignes.</h2><p>Une question sur une composition ? L’atelier répond à <a href="mailto:bonjour@maylune.fr">bonjour@maylune.fr</a>.</p></div>
        <div className="faq-list reveal">{faqs.map((item, index) => <div className={`faq-item ${openFaq === index ? 'open' : ''}`} key={item.q}><button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span>0{index + 1}</span><strong>{item.q}</strong><i>{openFaq === index ? '−' : '+'}</i></button><div><p>{item.a}</p></div></div>)}</div>
      </section>

      <section className="newsletter">
        <div><p className="eyebrow">Le carnet de couleurs</p><h2>Les prochaines palettes, avant tout le monde.</h2><p>Une à deux lettres par mois : nouveaux accords, éditions limitées et conseils pour les porter.</p></div>
        <form onSubmit={(event) => { event.preventDefault(); showNotice('Bienvenue dans le carnet MAYLUNE'); }}><label htmlFor="email">Votre adresse e-mail</label><div><input id="email" type="email" placeholder="vous@exemple.fr" required /><button type="submit" aria-label="S’inscrire"><ArrowIcon /></button></div><small>10 € offerts sur votre première création. Désinscription en un clic.</small></form>
      </section>

      <footer className="footer">
        <div className="footer-top"><Brand light /><p>Des sacs crochetés à la commande.<br />Des compositions choisies par vous.</p><div className="socials"><a href="#">Instagram</a><a href="#">TikTok</a><a href="#">Pinterest</a></div></div>
        <div className="footer-links"><div><h3>Découvrir</h3><a href="#collection">Les silhouettes</a><a href="#personnaliser">Composer mon sac</a></div><div><h3>Comprendre</h3><a href="#savoir-faire">Le savoir-faire</a><a href="#faq">Livraison & retours</a><a href="#faq">Entretien</a></div><div><h3>Nous écrire</h3><a href="mailto:bonjour@maylune.fr">bonjour@maylune.fr</a><a href="#">Suivre ma commande</a><a href="#">Instagram</a></div></div>
        <div className="footer-payments"><div><span>Paiement sécurisé</span><small>Les moyens proposés s’affichent au paiement.</small></div><PaymentLogos light /></div>
        <div className="footer-bottom"><span>© 2026 MAYLUNE</span><span>CGV · Confidentialité · Mentions légales</span><span>France · EUR €</span></div>
      </footer>
    </main>
  );
}
