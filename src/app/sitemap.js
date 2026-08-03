import { siteUrl } from '../lib/site';

export const dynamic = 'force-static';

export default function sitemap() {
  return [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}informations-legales/`, changeFrequency: 'monthly', priority: 0.3 },
  ];
}
