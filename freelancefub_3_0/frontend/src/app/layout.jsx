import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
  title: 'FreelanceHub - Платформа для фрілансерів',
  description: 'Знаходьте найкращих фрілансерів або цікаві проєкти на FreelanceHub',
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
