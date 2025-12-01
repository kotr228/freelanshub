import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5173'),
  title: {
    default: 'FreelanceHub - Платформа для фрілансерів та замовників',
    template: '%s | FreelanceHub'
  },
  description: 'FreelanceHub - найкраща платформа для пошуку фрілансерів в Україні. Знаходьте професіоналів або цікаві проєкти. Безпечні угоди, прозора система рейтингів.',
  keywords: ['фріланс', 'фрілансери', 'freelance', 'проєкти', 'віддалена робота', 'замовлення', 'Україна'],
  authors: [{ name: 'FreelanceHub Team' }],
  creator: 'FreelanceHub',
  publisher: 'FreelanceHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: '/',
    title: 'FreelanceHub - Платформа для фрілансерів та замовників',
    description: 'Знаходьте найкращих фрілансерів або цікаві проєкти на FreelanceHub',
    siteName: 'FreelanceHub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FreelanceHub - Платформа для фрілансерів',
    description: 'Знаходьте найкращих фрілансерів або цікаві проєкти на FreelanceHub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body className="bg-dark text-white">
        <AuthProvider>
          <div className="min-h-screen bg-dark flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
