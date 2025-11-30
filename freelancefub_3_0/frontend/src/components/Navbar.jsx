'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-dark-card shadow-lg border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary hover:text-primary-light transition-colors">
              FreelanceHub
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/projects" className="px-3 py-2 text-gray-300 hover:text-primary transition-colors">
              Проєкти
            </Link>

            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="px-3 py-2 text-gray-300 hover:text-primary transition-colors">
                  Панель
                </Link>
                <Link href="/chat" className="px-3 py-2 text-gray-300 hover:text-primary transition-colors">
                  💬 Чат
                </Link>
                <Link href="/settings" className="px-3 py-2 text-gray-300 hover:text-primary transition-colors">
                  ⚙️
                </Link>
                {user?.role === 'client' && (
                  <Link href="/create-project" className="bg-primary text-dark px-4 py-2 rounded-lg hover:bg-primary-dark font-semibold">
                    Створити проєкт
                  </Link>
                )}
                <Link href={`/profile/${user?.id}`} className="px-3 py-2 text-primary hover:text-primary-light font-semibold">
                  {user?.name}
                </Link>
                <button onClick={logout} className="px-3 py-2 text-red-400 hover:text-red-300">
                  Вихід
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 text-gray-300 hover:text-primary">
                  Вхід
                </Link>
                <Link href="/register" className="bg-primary text-dark px-4 py-2 rounded-lg hover:bg-primary-dark font-semibold">
                  Реєстрація
                </Link>
              </>
            )}
          </div>

          {/* Mobile button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-primary p-2">
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-primary/20 mt-2">
            <div className="flex flex-col space-y-2 pt-4">
              <Link href="/projects" className="px-3 py-2 text-gray-300 hover:text-primary hover:bg-dark-lighter rounded" onClick={() => setMobileMenuOpen(false)}>
                Проєкти
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="px-3 py-2 text-gray-300 hover:text-primary hover:bg-dark-lighter rounded" onClick={() => setMobileMenuOpen(false)}>
                    Панель
                  </Link>
                  <Link href="/chat" className="px-3 py-2 text-gray-300 hover:text-primary hover:bg-dark-lighter rounded" onClick={() => setMobileMenuOpen(false)}>
                    💬 Чат
                  </Link>
                  <Link href="/settings" className="px-3 py-2 text-gray-300 hover:text-primary hover:bg-dark-lighter rounded" onClick={() => setMobileMenuOpen(false)}>
                    ⚙️ Налаштування
                  </Link>
                  {user?.role === 'client' && (
                    <Link href="/create-project" className="px-3 py-2 bg-primary text-dark rounded hover:bg-primary-dark font-semibold text-center" onClick={() => setMobileMenuOpen(false)}>
                      Створити проєкт
                    </Link>
                  )}
                  <Link href={`/profile/${user?.id}`} className="px-3 py-2 text-primary hover:text-primary-light rounded font-semibold" onClick={() => setMobileMenuOpen(false)}>
                    {user?.name}
                  </Link>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-dark-lighter rounded text-left">
                    Вихід
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-3 py-2 text-gray-300 hover:text-primary hover:bg-dark-lighter rounded" onClick={() => setMobileMenuOpen(false)}>
                    Вхід
                  </Link>
                  <Link href="/register" className="px-3 py-2 bg-primary text-dark rounded hover:bg-primary-dark font-semibold text-center" onClick={() => setMobileMenuOpen(false)}>
                    Реєстрація
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
