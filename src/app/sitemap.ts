import type { MetadataRoute } from 'next';
import { getAllBookIds } from '@/lib/books';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.AUTH_URL || 'http://localhost:3000';
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/books`, changeFrequency: 'daily', priority: 0.8 },
    ...getAllBookIds().map((id) => ({
      url: `${base}/books/${id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ];
}
