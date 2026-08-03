const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.GITHUB_PAGES === '1'
    ? 'https://mazen-create11.github.io/maylune-store/'
    : 'http://localhost:3000/');

export const siteUrl = configuredSiteUrl.endsWith('/') ? configuredSiteUrl : `${configuredSiteUrl}/`;
