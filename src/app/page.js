'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { commerceReady, createCheckout } from '../lib/shopify';

const CART_KEY = 'maylune-cart-v1';

const products = [
  {
    id: 'rosalie',
    name: 'Rosalie',
    type: 'Mini bandoulière',
    price: 59,
    image: '/images/rosalie.webp',
    alt: 'Sac Rosalie MAYLUNE framboise et bordeaux avec chaîne dorée',
    badge: 'Bestseller',
    usage: 'Pour sortir légère',
    capacity: 'Téléphone · cartes · rouge à lèvres',
    plaquePosition: { left: '57%', top: '58%' },
    previewPosition: 'center',
  },
  {
    id: 'capri',
    name: 'Capri',
    type: 'Sac épaule souple',
    price: 69,
    image: '/images/palette-french-kiss.webp',
    alt: 'Sac Capri MAYLUNE framboise à anse tressée bordeaux',
    badge: 'Signature',
    usage: 'Pour tous les jours',
    capacity: 'Portefeuille · clés · lunettes',
    plaquePosition: { left: '63%', top: '74%' },
    previewPosition: 'center',
  },
  {
    id: 'colette',
    name: 'Colette',
    type: 'Cabas quotidien',
    price: 99,
    image: '/images/colette.webp',
    alt: 'Cabas Colette MAYLUNE crocheté main',
    badge: 'Grande capacité',
    usage: 'Pour les journées pleines',
    capacity: 'Tablette · trousse · bouteille',
    plaquePosition: { left: '50%', top: '52%' },
    previewPosition: 'center',
  },
  {
    id: 'mini-muse',
    name: 'Mini Muse',
    type: 'Mini sac épaule',
    price: 49,
    image: '/images/hero-maylune.webp',
    alt: 'Mini Muse MAYLUNE porté au soleil',
    badge: 'Dès 49 €',
    usage: 'Pour le soir',
    capacity: 'Téléphone · cartes · écouteurs',
    plaquePosition: { left: '68%', top: '65%' },
    previewPosition: '69% center',
  },
];

// Nuancier : image null = pastille CSS en attendant les photos de pelotes (Codex).
const yarnColors = [
  { id: 'ivoire', name: 'Ivoire', family: 'Les neutres', hex: '#f1eae0', image: null },
  { id: 'creme', name: 'Crème', family: 'Les neutres', hex: '#eadfc6', image: null },
  { id: 'nude', name: 'Nude', family: 'Les neutres', hex: '#d8b697', image: null },
  { id: 'sable', name: 'Sable', family: 'Les neutres', hex: '#c1a17b', image: null },
  { id: 'rose-poudre', name: 'Rose poudré', family: 'Les roses', hex: '#ecc4cd', image: null },
  { id: 'vieux-rose', name: 'Vieux rose', family: 'Les roses', hex: '#c68b9f', image: null },
  { id: 'bonbon', name: 'Rose bonbon', family: 'Les roses', hex: '#ec7cab', image: null },
  { id: 'fuchsia', name: 'Fuchsia', family: 'Les roses', hex: '#cf2f7b', image: null },
  { id: 'beurre', name: 'Beurre', family: 'Les solaires', hex: '#f0d999', image: null },
  { id: 'moutarde', name: 'Moutarde', family: 'Les solaires', hex: '#d3962f', image: null },
  { id: 'abricot', name: 'Abricot', family: 'Les solaires', hex: '#e28153', image: null },
  { id: 'coquelicot', name: 'Coquelicot', family: 'Les solaires', hex: '#bf3a2b', image: null },
  { id: 'bordeaux', name: 'Bordeaux', family: 'Les profonds', hex: '#772335', image: null },
  { id: 'aubergine', name: 'Aubergine', family: 'Les profonds', hex: '#5a3852', image: null },
  { id: 'lila', name: 'Lila', family: 'Les profonds', hex: '#b191ba', image: null },
  { id: 'violet', name: 'Violet', family: 'Les profonds', hex: '#67478c', image: null },
  { id: 'ciel', name: 'Ciel', family: 'Les froids', hex: '#a9c3da', image: null },
  { id: 'sauge', name: 'Sauge', family: 'Les froids', hex: '#a9bd8f', image: null },
  { id: 'cobalt', name: 'Cobalt', family: 'Les froids', hex: '#2b56b6', image: null },
  { id: 'marine', name: 'Marine', family: 'Les froids', hex: '#2a3a5c', image: null },
];

const yarnFamilies = ['Les neutres', 'Les roses', 'Les solaires', 'Les profonds', 'Les froids'];
const colorRoles = ['La dominante', 'La compagne', 'L’accent', 'La touche'];
const recipeShares = { 1: [100], 2: [62, 38], 3: [55, 28, 17], 4: [48, 26, 16, 10] };

// Options payantes : les couleurs sont incluses, la matière ajoutée se paie.
const finishCatalog = {
  'chaine-or': { name: 'Chaîne dorée', group: 'chaine', price: 10, note: 'Acier inoxydable · 120 cm', chip: 'gold', icon: 'chain' },
  'chaine-argent': { name: 'Chaîne argentée', group: 'chaine', price: 10, note: 'Acier inoxydable · 120 cm', chip: 'silver', icon: 'chain' },
  franges: { name: 'Franges', group: 'franges', price: 5, note: 'Crochetées dans vos couleurs', chip: 'plain', icon: 'fringe' },
  'fil-dore': { name: 'Fil doré', group: 'fil', price: 3, note: 'Éclat tissé dans la maille', chip: 'gold', icon: 'thread' },
  'fil-argent': { name: 'Fil argenté', group: 'fil', price: 3, note: 'Éclat tissé dans la maille', chip: 'silver', icon: 'thread' },
  poche: { name: 'Poche zippée', group: 'poche', price: 8, note: 'Doublée, à l’intérieur', chip: 'plain', icon: 'zip' },
};

const finishesByProduct = {
  rosalie: ['chaine-or', 'chaine-argent', 'franges', 'fil-dore', 'fil-argent', 'poche'],
  capri: ['chaine-or', 'chaine-argent', 'franges', 'fil-dore', 'fil-argent', 'poche'],
  colette: ['franges', 'fil-dore', 'fil-argent', 'poche'],
  'mini-muse': ['chaine-or', 'chaine-argent', 'fil-dore', 'fil-argent', 'poche'],
};

const faqs = [
  {
    q: 'Combien de couleurs puis-je choisir ?',
    a: 'De une à quatre, sans supplément. La première devient la dominante du sac, les suivantes l’accompagnent dans l’ordre de votre recette. Avant de crocheter, l’atelier peut vous envoyer une photo de vos fils côte à côte pour valider l’accord.',
  },
  {
    q: 'Quand vais-je recevoir ma création ?',
    a: 'Prévoyez 7 à 12 jours ouvrés de confection, puis 2 à 4 jours de livraison en France métropolitaine. La livraison est offerte dès 79 € ; sous ce seuil, le tarif exact s’affiche au moment du paiement selon votre adresse. Vous recevez un e-mail au démarrage de l’atelier, puis le suivi du colis.',
  },
  {
    q: 'Que puis-je personnaliser exactement ?',
    a: 'La forme, votre recette de une à quatre couleurs, les finitions compatibles avec le modèle (chaîne, franges, fil métallisé, poche) et une plaque de trois initiales. Le prix se met à jour à chaque choix.',
  },
  {
    q: 'Qui crochète mon sac ?',
    a: 'Joudy, dans son atelier installé chez elle, avec les fils et le matériel qu’elle a choisis. Chaque pièce est crochetée à la commande, d’une seule paire de mains, puis contrôlée avant la mise en écrin.',
  },
  {
    q: 'Le sac garde-t-il sa forme ?',
    a: 'Le fil et le point sont choisis pour donner de la tenue sans rigidité. La doublure et les finitions renforcent les zones les plus sollicitées.',
  },
  {
    q: 'Puis-je modifier ou retourner ma commande ?',
    a: 'Tant que la confection n’a pas commencé, couleurs et finitions restent modifiables : le moyen de contact de l’atelier figurera dans votre e-mail de confirmation. Une pièce crochetée selon vos choix ne peut pas être remise en vente ; en cas de défaut, l’atelier vous propose une solution avec photos à l’appui.',
  },
  {
    q: 'Comment entretenir le crochet ?',
    a: 'Nettoyez localement avec un linge humide et un savon doux, sans frotter. Séchage à plat, loin d’une source de chaleur. Ni machine ni sèche-linge.',
  },
];

// Avis verbatim des ventes directes de l'atelier (fournis par la cliente le 04/08/2026).
// Écartés volontairement : les témoignages citant des services que la marque n'a pas encore (voir content.test.mjs).
const reviews = [
  { name: 'Lily A.', rating: 5, text: 'J’ai commandé un sac pour ma fille et franchement je suis ravie. Il est encore plus beau en vrai, la qualité est au rendez-vous et les finitions sont super propres. Je recommande sans hésiter !' },
  { name: 'Sarah M.', rating: 5, text: 'Franchement je suis super contente de mon achat ! Le sac est magnifique, les finitions sont très propres et la couleur est encore plus belle en vrai. Ma fille l’adore et ne le quitte plus.' },
  { name: 'Inès D.', rating: 4, text: 'Le sac est vraiment superbe et correspond exactement aux photos. J’ai juste trouvé le délai de livraison un peu plus long que prévu, mais ça valait largement l’attente.' },
  { name: 'Camille R.', rating: 5, text: 'Très belle surprise ! Le sac est solide, léger et vraiment adorable. Les photos sont fidèles au produit reçu. Je vais sûrement en reprendre un dans une autre couleur.' },
  { name: 'Sofia A.', rating: 5, text: 'Commande reçue rapidement, emballage soigné et produit impeccable. On voit que c’est fait avec soin. Je suis vraiment satisfaite de mon achat.' },
  { name: 'Manon G.', rating: 5, text: 'J’ai pris le modèle rose et il est encore plus joli que sur les photos. Les coutures sont bien faites et le sac fait vraiment son petit effet.' },
];

const steps = ['La forme', 'Les couleurs', 'Les finitions', 'La plaque'];

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

function StarIcon({ off = false }) {
  return <svg className={`star ${off ? 'off' : ''}`} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.4l2.7 5.4 6 .9-4.3 4.2 1 5.9-5.4-2.8-5.4 2.8 1-5.9L3.3 9.7l6-.9z" /></svg>;
}

function ChainIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="9" width="8" height="6" rx="3" /><rect x="13" y="9" width="8" height="6" rx="3" /></svg>;
}

function FringeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16" /><path d="M6 7v10M10 7v12M14 7v10M18 7v12" /></svg>;
}

function ThreadIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 16c3-8 6 6 9-4s6 2 9-6" /></svg>;
}

function ZipIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v13" /><path d="M9 6h6M9 9h6M9 12h6" /><circle cx="12" cy="19" r="2.4" /></svg>;
}

const finishIcons = { chain: ChainIcon, fringe: FringeIcon, thread: ThreadIcon, zip: ZipIcon };

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

function YarnDot({ color, size = 'md' }) {
  if (color.image) {
    return (
      <i className={`yarn-dot yarn-photo yarn-${size}`} aria-hidden="true">
        <Image src={color.image} alt="" fill sizes="56px" />
      </i>
    );
  }
  return <i className={`yarn-dot yarn-${size}`} style={{ '--yarn': color.hex }} aria-hidden="true" />;
}

function ProductCard({ product, onChoose }) {
  return (
    <article className="product-card reveal">
      <div className="product-media">
        <Image src={product.image} alt={product.alt} fill sizes="(max-width: 760px) 82vw, 25vw" />
        <span className="product-badge">{product.badge}</span>
        <button type="button" className="product-choose" onClick={() => onChoose(product)}>Composer ce modèle <ArrowIcon /></button>
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
  const [cartHydrated, setCartHydrated] = useState(false);
  const [checkoutState, setCheckoutState] = useState('idle');
  const [selectedProduct, setSelectedProduct] = useState(products[1]);
  const [selectedColors, setSelectedColors] = useState(['rose-poudre']);
  const [selectedFinishes, setSelectedFinishes] = useState([]);
  const [initials, setInitials] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [notice, setNotice] = useState('');
  const menuCloseRef = useRef(null);
  const cartCloseRef = useRef(null);
  const lastTriggerRef = useRef(null);
  const lastAddRef = useRef(false);

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

  useEffect(() => {
    let savedCart = [];
    try {
      const storedCart = JSON.parse(window.localStorage.getItem(CART_KEY) || '[]');
      if (Array.isArray(storedCart)) savedCart = storedCart;
    } catch {
      window.localStorage.removeItem(CART_KEY);
    }
    const frame = window.requestAnimationFrame(() => {
      setCart(savedCart);
      setCartHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (cartHydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, cartHydrated]);

  useEffect(() => {
    const drawerClose = menuOpen ? menuCloseRef.current : cartOpen ? cartCloseRef.current : null;
    if (!drawerClose) return undefined;
    drawerClose.focus();
    const handleEscape = (event) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      setCartOpen(false);
      window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuOpen, cartOpen]);

  const availableFinishes = finishesByProduct[selectedProduct.id].map((id) => ({ id, ...finishCatalog[id] }));
  const recipe = selectedColors.map((id, index) => ({
    color: yarnColors.find((entry) => entry.id === id),
    share: recipeShares[selectedColors.length][index],
    role: colorRoles[index],
  }));
  const recipeNames = recipe.map((entry) => entry.color.name);
  const recipeStops = recipe.map((entry, index) => {
    const from = recipe.slice(0, index).reduce((sum, previous) => sum + previous.share, 0);
    return `${entry.color.hex} ${from}% ${from + entry.share}%`;
  });
  const recipeGradient = `linear-gradient(180deg, ${recipeStops.join(', ')})`;
  const optionTotal = selectedFinishes.reduce((sum, id) => sum + finishCatalog[id].price, 0);
  const total = selectedProduct.price + optionTotal + (initials ? 8 : 0);
  const selectedDetails = selectedFinishes.map((id) => finishCatalog[id].name);
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3000);
  }

  function openDrawer(type, trigger) {
    lastTriggerRef.current = trigger;
    setMenuOpen(type === 'menu');
    setCartOpen(type === 'cart');
  }

  function closeDrawers() {
    setMenuOpen(false);
    setCartOpen(false);
    window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }

  function trapFocus(event) {
    if (event.key !== 'Tab') return;
    const focusable = [...event.currentTarget.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function addToCart(item, trigger) {
    lastTriggerRef.current = trigger;
    setCart((current) => [...current, item]);
    setCartOpen(true);
    showNotice(`${item.name} a été ajouté au panier`);
  }

  function addConfiguredBag(trigger) {
    // garde anti double-clic : deux clics rapprochés ne doivent produire qu'un article
    if (lastAddRef.current) return;
    lastAddRef.current = true;
    window.setTimeout(() => { lastAddRef.current = false; }, 800);
    const configurationId = crypto.randomUUID();
    addToCart({
      id: `${selectedProduct.id}-${configurationId}`,
      configurationId,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      paletteName: recipeNames.join(' · '),
      colorIds: [...selectedColors],
      finishIds: [...selectedFinishes],
      finishNames: [...selectedDetails],
      initials,
      name: `${selectedProduct.name} personnalisé`,
      price: total,
      image: selectedProduct.image,
      details: `${recipeNames.join(' · ')}${selectedDetails.length ? ` · ${selectedDetails.join(', ')}` : ''}${initials ? ` · ${initials}` : ''}`,
    }, trigger);
    // la composition suivante repart propre : finitions et gravure ne s'héritent pas en silence
    setSelectedFinishes([]);
    setInitials('');
    setActiveStep(0);
  }

  async function proceedToCheckout() {
    if (!commerceReady) {
      showNotice('Le paiement sécurisé sera activé à l’ouverture des commandes.');
      return;
    }
    try {
      setCheckoutState('loading');
      const checkout = await createCheckout(cart);
      window.location.assign(checkout.checkoutUrl);
    } catch (error) {
      setCheckoutState('error');
      showNotice(error instanceof Error ? error.message : 'Le paiement est momentanément indisponible.');
    }
  }

  function selectProduct(product, scroll = false) {
    setSelectedProduct(product);
    setSelectedFinishes((current) => current.filter((id) => finishesByProduct[product.id].includes(id)));
    if (scroll) {
      setActiveStep(0);
      window.setTimeout(() => document.querySelector('#config-start')?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }

  function toggleColor(color) {
    if (selectedColors.includes(color.id)) {
      removeColor(color);
      return;
    }
    if (selectedColors.length === 4) {
      showNotice(`Quatre fils maximum : retirez une couleur pour essayer ${color.name}.`);
      return;
    }
    setSelectedColors((current) => [...current, color.id]);
  }

  function removeColor(color) {
    if (selectedColors.length === 1) {
      showNotice('Votre sac a besoin d’au moins une couleur.');
      return;
    }
    setSelectedColors((current) => current.filter((id) => id !== color.id));
  }

  function toggleFinish(finish) {
    setSelectedFinishes((current) => {
      if (current.includes(finish.id)) return current.filter((id) => id !== finish.id);
      return [...current.filter((id) => finishCatalog[id].group !== finish.group), finish.id];
    });
  }

  function updateInitials(value) {
    // é → E, ç → C : on translittère avant de filtrer pour ne pas avaler les accents
    setInitials(value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3));
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
        <span>1 à 4 couleurs incluses · crocheté à la commande</span>
      </div>

      <header className="site-header">
        <button type="button" className="icon-button mobile-only" onClick={(event) => openDrawer('menu', event.currentTarget)} aria-label="Ouvrir le menu"><MenuIcon /></button>
        <nav className="desktop-nav" aria-label="Navigation principale">
          <a href="#collection">Les silhouettes</a><a href="#config-start">Composer</a><a href="#savoir-faire">Le geste</a>
        </nav>
        <a href="#content" className="logo-link"><Brand /></a>
        <div className="header-actions"><a className="desktop-link" href="#faq">FAQ</a><button type="button" className="cart-button" onClick={(event) => openDrawer('cart', event.currentTarget)}><BagIcon /><span>Panier</span><b>{cart.length}</b></button></div>
      </header>

      <aside className={`drawer menu-drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen} inert={!menuOpen} role="dialog" aria-modal="true" aria-label="Menu" onKeyDown={trapFocus}>
        <div className="drawer-head"><Brand /><button ref={menuCloseRef} type="button" className="icon-button" onClick={closeDrawers} aria-label="Fermer le menu"><CloseIcon /></button></div>
        <nav>{['Les silhouettes', 'Composer mon sac', 'Le savoir-faire', 'FAQ'].map((item, index) => <a key={item} href={['#collection', '#config-start', '#savoir-faire', '#faq'][index]} onClick={closeDrawers}><span>0{index + 1}</span>{item}<ArrowIcon /></a>)}</nav>
        <p>Les coordonnées de l’atelier seront publiées avant l’ouverture des commandes.</p>
      </aside>

      <aside className={`drawer cart-drawer ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen} inert={!cartOpen} role="dialog" aria-modal="true" aria-label="Panier" onKeyDown={trapFocus}>
        <div className="drawer-head"><div><span className="micro-label">Votre sélection</span><h2>Le panier</h2></div><button ref={cartCloseRef} type="button" className="icon-button" onClick={closeDrawers} aria-label="Fermer le panier"><CloseIcon /></button></div>
        {cart.length === 0 ? <div className="empty-cart"><BagIcon /><h3>Commencez par une forme.</h3><p>Puis composez les couleurs qui la rendront vôtre.</p><a className="button button-dark" href="#collection" onClick={closeDrawers}>Voir les silhouettes</a></div> : <>
          <div className="cart-items">{cart.map((item) => <article className="cart-item" key={item.id}><div className="cart-thumb"><Image src={item.image} alt="" fill sizes="88px" />{item.colorIds && <span className="cart-thumb-recipe">{item.colorIds.map((id) => <i key={id} style={{ '--yarn': yarnColors.find((entry) => entry.id === id)?.hex }} />)}</span>}</div><div><h3>{item.name}</h3><p>{item.details}</p><strong>{item.price} €</strong></div><button type="button" onClick={() => setCart((current) => current.filter((currentItem) => currentItem.id !== item.id))} aria-label={`Retirer ${item.name}`}>×</button></article>)}</div>
          <div className="cart-footer"><div><span>Sous-total</span><strong>{cartTotal} €</strong></div><p>{cartTotal >= 79 ? 'Livraison offerte en France métropolitaine.' : `Encore ${79 - cartTotal} € pour profiter de la livraison offerte.`}</p><button type="button" className={`button button-accent ${commerceReady ? '' : 'button-pending'}`} onClick={proceedToCheckout} aria-disabled={!commerceReady || checkoutState === 'loading'}>{checkoutState === 'loading' ? 'Préparation du paiement…' : commerceReady ? 'Passer au paiement' : 'Commandes bientôt ouvertes'} <ArrowIcon /></button>{commerceReady ? <><div className="secure-copy"><CheckIcon /> Paiement Shopify chiffré et sécurisé</div><PaymentLogos /></> : <div className="checkout-disclosure"><CheckIcon /> Votre composition est conservée sur cet appareil. Le paiement sera activé à l’ouverture.</div>}</div>
        </>}
      </aside>
      <button type="button" className={`drawer-overlay ${menuOpen || cartOpen ? 'show' : ''}`} onClick={closeDrawers} aria-label="Fermer" />
      <div className={`toast ${notice ? 'show' : ''}`} role="status"><CheckIcon />{notice}</div>

      <section className="hero" id="content">
        <div className="hero-copy">
          <p className="eyebrow">Sacs crochetés à la commande</p>
          <h1>Vos couleurs.<br /><em>Votre sac.</em></h1>
          <p className="hero-lead">Une forme, jusqu’à quatre couleurs, vos initiales. L’atelier crochète votre pièce, maille après maille.</p>
          <div className="hero-actions"><a className="button button-accent" href="#config-start">Composer mon sac <ArrowIcon /></a><a className="text-link" href="#collection">Voir les silhouettes</a></div>
          <ul className="hero-facts"><li><b>Dès 49 €</b><span>couleurs incluses</span></li><li><b>16 coloris</b><span>1 à 4 par sac</span></li><li><b>7–12 jours</b><span>confection à la commande</span></li></ul>
        </div>
        <figure className="hero-visual">
          <Image src="/images/hero-maylune.webp" alt="Mini sac MAYLUNE crocheté porté avec une tenue en lin" fill priority fetchPriority="high" sizes="(max-width: 800px) 100vw, 55vw" />
          <a className="mobile-hero-cta button button-light" href="#config-start">Composer mon sac <ArrowIcon /></a>
          <figcaption><span>Mini Muse · composée main</span><strong>Dès 49 €</strong></figcaption>
          <div className="hero-seal"><span>M</span><small>Composé<br />pour vous</small></div>
        </figure>
      </section>

      <div className="shade-ribbon" aria-hidden="true">
        <div className="shade-track">
          {[...yarnColors, ...yarnColors].map((color, index) => (
            <span key={`${color.id}-${index}`} className="shade-item"><YarnDot color={color} size="sm" />{color.name}</span>
          ))}
        </div>
      </div>

      <section className="proof-rail" aria-label="Les engagements MAYLUNE" tabIndex={0}><div><span>01</span><p><b>16 coloris</b> à composer librement, sans supplément</p></div><div><span>02</span><p><b>4 silhouettes</b> selon ce que vous emportez</p></div><div><span>03</span><p><b>Prix final</b> connu avant le panier</p></div></section>

      <section className="collection section" id="collection">
        <div className="section-heading reveal"><div><p className="eyebrow">01 · La forme</p><h2>Commencez par la <em>silhouette.</em></h2></div><p>Un mini pour sortir, une forme souple au quotidien ou un cabas qui suit toute la journée.</p></div>
        <div className="carousel-hint"><span>Glissez pour comparer</span><strong>01 · 04</strong></div>
        <div className="product-grid" tabIndex={0} aria-label="Comparer les quatre silhouettes">{products.map((product) => <ProductCard key={product.id} product={product} onChoose={(item) => selectProduct(item, true)} />)}</div>
      </section>

      <section className="campaign-band reveal">
        <Image src="/images/campaign.webp" alt="Trois femmes portant des sacs MAYLUNE colorés au bord de la Méditerranée" fill sizes="100vw" />
        <div className="campaign-overlay"><p className="eyebrow">Portées partout</p><h2>La couleur fait la tenue.</h2><a className="button button-light" href="#config-start">Composer la mienne <ArrowIcon /></a></div>
      </section>

      <section className="configurator section" id="personnaliser">
        <div className="config-intro reveal"><div><p className="eyebrow">02 · L’atelier de composition</p><h2>Quatre décisions. <em>Le prix en direct.</em></h2></div><p>La silhouette choisie reste à l’écran du premier clic jusqu’au panier.</p></div>

        <div className="config-shell reveal">
          <div className="config-visual">
            <figure className="main-preview">
              <Image key={selectedProduct.image} src={selectedProduct.image} alt={`Silhouette ${selectedProduct.name} MAYLUNE`} fill sizes="(max-width: 900px) 100vw, 48vw" style={{ objectPosition: selectedProduct.previewPosition }} />
              {activeStep === 3 && initials && <span className="preview-plaque" style={{ '--plaque-x': selectedProduct.plaquePosition.left, '--plaque-y': selectedProduct.plaquePosition.top }}>{initials}</span>}
              <div className="recipe-edge" style={{ background: recipeGradient }} />
              <figcaption><div><span>Votre base</span><strong>{selectedProduct.name}</strong></div><div><span>Votre recette</span><strong className="figcaption-recipe">{recipeNames.join(' · ')}</strong></div></figcaption>
            </figure>
          </div>

          <div className="config-panel" id="config-start">
            <figure className="mobile-config-preview">
              <Image key={`mobile-${selectedProduct.image}`} src={selectedProduct.image} alt={`Aperçu de ${selectedProduct.name}`} fill sizes="100vw" style={{ objectPosition: selectedProduct.previewPosition }} />
              {activeStep === 3 && initials && <span className="preview-plaque" style={{ '--plaque-x': selectedProduct.plaquePosition.left, '--plaque-y': selectedProduct.plaquePosition.top }}>{initials}</span>}
              <div className="recipe-edge" style={{ background: recipeGradient }} />
              <figcaption><span>{selectedProduct.name}</span><strong className="figcaption-recipe">{recipeNames.join(' · ')}</strong></figcaption>
            </figure>
            <div className="config-top">
              <div className="config-top-main"><span>Votre composition</span><strong>{selectedProduct.name}</strong><small>{recipeNames.join(' · ')}{selectedDetails.length ? ` · ${selectedDetails.join(', ')}` : ''}{initials ? ` · ${initials}` : ''}</small></div>
              <div className="config-top-price"><b>{total} €</b><small>{total > selectedProduct.price ? `${selectedProduct.name} ${selectedProduct.price} € + options ${total - selectedProduct.price} €` : 'couleurs incluses'}</small></div>
            </div>
            <nav className="stepper" aria-label="Étapes de personnalisation">{steps.map((step, index) => <button type="button" key={step} className={`${index === activeStep ? 'active' : ''} ${index < activeStep ? 'done' : ''}`} onClick={() => setActiveStep(index)} aria-current={index === activeStep ? 'step' : undefined} aria-label={`${step}, étape ${index + 1} sur 4`}><span>{index < activeStep ? <CheckIcon /> : `0${index + 1}`}</span><b>{step}</b></button>)}</nav>

            <div className="step-content">
              {activeStep === 0 && <section className="choice-step"><header><span>Étape 1 sur 4</span><h3>Quel rythme aura votre sac ?</h3><p>Choisissez selon ce que vous emportez.</p></header><div className="shape-options">{products.map((product) => <button type="button" key={product.id} className={selectedProduct.id === product.id ? 'selected' : ''} onClick={() => selectProduct(product)} aria-pressed={selectedProduct.id === product.id}><span className="choice-photo"><Image src={product.image} alt="" fill sizes="96px" /></span><span className="choice-copy"><b>{product.name}</b><small>{product.usage}</small><em>{product.capacity}</em></span><strong>{product.price} €</strong>{selectedProduct.id === product.id && <i><CheckIcon /></i>}</button>)}</div></section>}

              {activeStep === 1 && <section className="choice-step"><header><span>Étape 2 sur 4 · {selectedProduct.name}</span><h3>Composez vos couleurs.</h3><p>De une à quatre, incluses dans le prix. La première domine, les suivantes l’accompagnent.</p></header>
                <div className="yarn-families">
                  {yarnFamilies.map((family) => (
                    <div className="yarn-family" key={family}>
                      <span>{family}</span>
                      <div className="yarn-row">
                        {yarnColors.filter((color) => color.family === family).map((color) => {
                          const position = selectedColors.indexOf(color.id);
                          return (
                            <button type="button" key={color.id} className={`yarn-choice ${position >= 0 ? 'selected' : ''}`} onClick={() => toggleColor(color)} aria-pressed={position >= 0} aria-label={position >= 0 ? `${color.name}, ${colorRoles[position]}` : `Ajouter ${color.name}`}>
                              <span className="yarn-well"><YarnDot color={color} />{position >= 0 && <b>{position + 1}</b>}</span>
                              <small>{color.name}</small>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="recipe">
                  <div className="recipe-head"><span>Votre recette</span><b>{selectedColors.length}/4 couleurs · incluses</b></div>
                  <div className="recipe-bar" role="img" aria-label={`Répartition : ${recipe.map((entry) => `${entry.color.name} ${entry.share}%`).join(', ')}`}>{recipe.map((entry) => <i key={entry.color.id} style={{ width: `${entry.share}%`, background: entry.color.hex }} />)}</div>
                  <div className="recipe-chips">{recipe.map((entry) => (
                    <button type="button" key={entry.color.id} onClick={() => removeColor(entry.color)} aria-label={`Retirer ${entry.color.name}`}>
                      <YarnDot color={entry.color} size="sm" /><span><small>{entry.role}</small><b>{entry.color.name}</b></span><em aria-hidden="true">×</em>
                    </button>
                  ))}</div>
                  <p className="recipe-note"><CheckIcon /> Sur demande, l’atelier vous envoie une photo de vos fils côte à côte avant de crocheter.</p>
                </div>
              </section>}

              {activeStep === 2 && <section className="choice-step"><header><span>Étape 3 sur 4 · {selectedProduct.name}</span><h3>Les finitions, si vous en voulez.</h3><p>Chacune est posée à l’atelier. Le prix s’ajuste en direct.</p></header><div className="finish-cards" tabIndex={0} aria-label={`Finitions disponibles pour ${selectedProduct.name}`}>{availableFinishes.map((finish) => { const selected = selectedFinishes.includes(finish.id); const Icon = finishIcons[finish.icon]; return <button type="button" key={finish.id} className={selected ? 'selected' : ''} onClick={() => toggleFinish(finish)} aria-pressed={selected}><span className={`finish-chip chip-${finish.chip}`}><Icon /></span><span className="finish-card-copy"><b>{finish.name}</b><small>{finish.note}</small><strong>+{finish.price} €</strong></span><i>{selected ? <CheckIcon /> : '+'}</i></button>; })}</div></section>}

              {activeStep === 3 && <section className="choice-step monogram-step"><header><span>Étape 4 sur 4 · {selectedProduct.name}</span><h3>Signez votre {selectedProduct.name}.</h3><p>Jusqu’à trois lettres gravées, toujours facultatives.</p></header><div className="monogram-layout"><div className="monogram-photo"><Image src={selectedProduct.image} alt={`${selectedProduct.name} avec aperçu de plaque`} fill sizes="240px" style={{ objectPosition: selectedProduct.previewPosition }} /><span className="monogram-photo-plaque" style={{ '--plaque-x': selectedProduct.plaquePosition.left, '--plaque-y': selectedProduct.plaquePosition.top }}>{initials || 'ML'}</span></div><div className="monogram-control"><span className="gold-plaque">{initials || 'ML'}</span><label htmlFor="initials">Vos initiales <small>+8 €</small></label><div><input id="initials" value={initials} onChange={(event) => updateInitials(event.target.value)} placeholder="Ex. AL" maxLength={3} /><span>{initials.length}/3</span></div><p>La taille finale est validée par l’atelier.</p></div></div></section>}
            </div>

            <div className="config-footer">
              <div className="config-recap"><span>Votre composition</span><p>{selectedProduct.name} · {selectedColors.length} couleur{selectedColors.length > 1 ? 's' : ''}{selectedDetails.length ? ` · ${selectedDetails.length} finition${selectedDetails.length > 1 ? 's' : ''}` : ''}{initials ? ` · ${initials}` : ''}</p></div>
              <div className="config-actions">{activeStep > 0 && <button type="button" className="back-button" onClick={() => setActiveStep((step) => step - 1)}><ArrowIcon direction="left" /> Retour</button>}<button type="button" className="button button-accent" onClick={(event) => activeStep < 3 ? setActiveStep((step) => step + 1) : addConfiguredBag(event.currentTarget)}>{activeStep < 3 ? `Continuer · ${steps[activeStep + 1]}` : 'Ajouter au panier'} <ArrowIcon /></button></div>
              <div className="config-pay"><span>Prix final : <strong>{total} €</strong></span>{commerceReady ? <PaymentLogos /> : <small>Paiement Shopify activé à l’ouverture</small>}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="reviews section" id="avis">
        <div className="section-heading reveal"><div><p className="eyebrow">03 · Elles ont commandé</p><h2>Déjà portées, <em>déjà adorées.</em></h2></div><p>Avis recueillis lors des ventes directes de l’atelier, avant l’ouverture du site.</p></div>
        <div className="review-grid" tabIndex={0} aria-label="Avis des clientes de l’atelier">{reviews.map((review) => (
          <figure className="review-card reveal" key={review.name}>
            <div className="review-stars" role="img" aria-label={`${review.rating} étoiles sur 5`}>{[1, 2, 3, 4, 5].map((position) => <StarIcon key={position} off={position > review.rating} />)}</div>
            <blockquote>{review.text}</blockquote>
            <figcaption>{review.name}</figcaption>
          </figure>
        ))}</div>
      </section>

      <section className="craft" id="savoir-faire">
        <div className="craft-image reveal"><Image src="/images/atelier.webp" alt="Joudy crochetant un sac MAYLUNE dans son atelier" fill sizes="(max-width: 800px) 100vw, 50vw" /><div><span>L’atelier de Joudy</span><strong>Maille après maille</strong></div></div>
        <div className="craft-copy reveal"><p className="eyebrow">Fait à la commande</p><h2>Crocheté par <em>Joudy.</em></h2><p className="craft-lead">Un petit atelier installé à la maison, les pelotes à portée de main, une seule pièce à la fois. Votre recette lance le geste.</p><ol><li><span>01</span><div><h3>La recette est vérifiée</h3><p>Forme, couleurs et finitions réunies sur une fiche d’atelier.</p></div></li><li><span>02</span><div><h3>Le sac prend forme</h3><p>Corps, anses et doublure assemblés puis contrôlés.</p></div></li><li><span>03</span><div><h3>Les finitions sont posées</h3><p>Plaque, chaîne et poche vérifiées avant la mise en écrin.</p></div></li></ol><div className="craft-fact"><strong>7–12 jours</strong><span>Estimation de confection avant expédition</span></div></div>
      </section>

      <section className="ritual section">
        <div className="ritual-copy reveal"><p className="eyebrow">L’arrivée</p><h2>L’écrin, pas un colis.</h2><p>Votre sac arrive protégé, avec sa recette et ses conseils d’entretien.</p><a className="button button-dark" href="#config-start">Composer le mien <ArrowIcon /></a></div>
        <figure className="ritual-main reveal"><Image src="/images/unboxing.webp" alt="Ouverture de l’écrin MAYLUNE" fill sizes="(max-width: 800px) 100vw, 48vw" /><figcaption>Écrin MAYLUNE · inclus</figcaption></figure>
        <figure className="ritual-detail reveal"><Image src="/images/rosalie.webp" alt="Détail du sac Rosalie MAYLUNE" fill sizes="(max-width: 800px) 70vw, 24vw" /><figcaption>Votre recette · votre plaque</figcaption></figure>
      </section>

      <section className="faq section" id="faq">
        <div className="faq-intro reveal"><p className="eyebrow">Avant de choisir</p><h2>Tout ce qu’il faut savoir.</h2><p>Les coordonnées de l’atelier seront publiées avant l’ouverture des commandes.</p></div>
        <div className="faq-list reveal">{faqs.map((item, index) => <div className={`faq-item ${openFaq === index ? 'open' : ''}`} key={item.q}><button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span>0{index + 1}</span><strong>{item.q}</strong><i>{openFaq === index ? '−' : '+'}</i></button><div><p>{item.a}</p></div></div>)}</div>
      </section>

      <footer className="footer">
        <div className="footer-top"><Brand light /><p>Des sacs crochetés à la commande.<br />Des recettes de couleurs choisies par vous.</p><span className="footer-signature">Vos couleurs · votre sac</span></div>
        <div className="footer-links"><div><h3>Découvrir</h3><a href="#collection">Les silhouettes</a><a href="#config-start">Composer mon sac</a></div><div><h3>Comprendre</h3><a href="#savoir-faire">Le savoir-faire</a><a href="#faq">Livraison & retours</a><a href="#faq">Entretien</a></div><div><h3>Informations</h3><a href="./informations-legales/">Informations légales</a><a href="#faq">Délais et personnalisation</a></div></div>
        <div className="footer-payments"><div><span>{commerceReady ? 'Paiement sécurisé' : 'Ouverture prochaine'}</span><small>{commerceReady ? 'Les moyens disponibles s’affichent au paiement Shopify.' : 'Le configurateur est disponible ; le paiement reste désactivé.'}</small></div>{commerceReady ? <PaymentLogos light /> : <span className="footer-commerce-status"><CheckIcon /> Ouverture des commandes en préparation</span>}</div>
        <div className="footer-bottom"><span>© 2026 MAYLUNE</span><a href="./informations-legales/">Conditions · Confidentialité · Mentions</a><span>France · EUR €</span></div>
      </footer>
    </main>
  );
}
