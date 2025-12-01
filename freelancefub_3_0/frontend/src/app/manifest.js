export default function manifest() {
  return {
    name: 'FreelanceHub - Платформа для фрілансерів',
    short_name: 'FreelanceHub',
    description: 'Платформа для пошуку фрілансерів та проєктів в Україні',
    start_url: '/',
    display: 'standalone',
    background_color: '#1A1A1A',
    theme_color: '#FFC107',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    categories: ['business', 'productivity'],
    lang: 'uk',
  };
}
