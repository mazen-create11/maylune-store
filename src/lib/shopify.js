const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/$/, '');
const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2026-07';

const variants = {
  products: {
    rosalie: process.env.NEXT_PUBLIC_SHOPIFY_VARIANT_ROSALIE,
    capri: process.env.NEXT_PUBLIC_SHOPIFY_VARIANT_CAPRI,
    colette: process.env.NEXT_PUBLIC_SHOPIFY_VARIANT_COLETTE,
    'mini-muse': process.env.NEXT_PUBLIC_SHOPIFY_VARIANT_MINI_MUSE,
  },
  options: {
    chain: process.env.NEXT_PUBLIC_SHOPIFY_VARIANT_CHAIN,
    pocket: process.env.NEXT_PUBLIC_SHOPIFY_VARIANT_POCKET,
    initials: process.env.NEXT_PUBLIC_SHOPIFY_VARIANT_INITIALS,
  },
};

const configuredVariants = [
  ...Object.values(variants.products),
  ...Object.values(variants.options),
];

export const commerceReady = Boolean(storeDomain && storefrontToken && configuredVariants.every(Boolean));

function configurationAttributes(item) {
  return [
    { key: 'Composition', value: item.configurationId },
    { key: 'Modèle', value: item.productName },
    { key: 'Palette', value: item.paletteName },
    { key: 'Finitions', value: item.finishNames.join(', ') },
    ...(item.initials ? [{ key: 'Initiales', value: item.initials }] : []),
  ];
}

function cartLines(items) {
  return items.flatMap((item) => {
    const attributes = configurationAttributes(item);
    const baseVariant = variants.products[item.productId];
    if (!baseVariant) throw new Error(`La variante Shopify de ${item.productName} manque.`);

    const lines = [{ merchandiseId: baseVariant, quantity: 1, attributes }];
    for (const optionId of item.finishIds.filter((id) => id !== 'braid')) {
      const optionVariant = variants.options[optionId];
      if (!optionVariant) throw new Error(`La variante Shopify de l’option ${optionId} manque.`);
      lines.push({
        merchandiseId: optionVariant,
        quantity: 1,
        attributes: [
          { key: 'Composition', value: item.configurationId },
          { key: 'Pour', value: item.productName },
        ],
      });
    }
    if (item.initials) {
      lines.push({
        merchandiseId: variants.options.initials,
        quantity: 1,
        attributes: [
          { key: 'Composition', value: item.configurationId },
          { key: 'Gravure', value: item.initials },
          { key: 'Pour', value: item.productName },
        ],
      });
    }
    return lines;
  });
}

export async function createCheckout(items) {
  if (!commerceReady) throw new Error('Le paiement Shopify n’est pas encore raccordé.');
  if (!items.length) throw new Error('Votre panier est vide.');

  const response = await fetch(`https://${storeDomain}/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({
      query: `
        mutation CreateMayluneCart($input: CartInput!) {
          cartCreate(input: $input) {
            cart { id checkoutUrl }
            userErrors { field message }
          }
        }
      `,
      variables: { input: { lines: cartLines(items) } },
    }),
  });

  if (!response.ok) throw new Error('Le paiement est momentanément indisponible.');
  const payload = await response.json();
  const result = payload.data?.cartCreate;
  const error = payload.errors?.[0]?.message || result?.userErrors?.[0]?.message;
  if (error || !result?.cart?.checkoutUrl) throw new Error(error || 'Impossible de créer le paiement.');
  return result.cart;
}
