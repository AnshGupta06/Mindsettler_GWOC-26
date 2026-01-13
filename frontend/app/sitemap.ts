import { MetadataRoute } from 'next';
import { resources } from '@/data/resources'; // Import your data sources
import { awarenessContent } from '@/app/(main)/awareness/[slug]/awarenessData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mindsettler-bypb.vercel.app'; // Your domain

  // 1. Static Pages
  const routes = [
    '',
    '/about',
    '/services',
    '/contact',
    '/book',
    '/awareness',
    '/resource',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Dynamic Awareness Pages
  const awarenessRoutes = Object.keys(awarenessContent).map((slug) => ({
    url: `${baseUrl}/awareness/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 3. Dynamic Resource Pages
  const resourceRoutes = resources.map((resource) => ({
    url: `${baseUrl}/resource/${resource.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...awarenessRoutes, ...resourceRoutes];
}