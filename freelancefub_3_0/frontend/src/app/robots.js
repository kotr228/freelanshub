export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5173';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/settings/', '/chat/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
