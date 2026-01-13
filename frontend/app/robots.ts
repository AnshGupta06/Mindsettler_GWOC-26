import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Hide admin pages from Google
    },
    sitemap: 'https://mindsettler-bypb.vercel.app/sitemap.xml',
  };
}