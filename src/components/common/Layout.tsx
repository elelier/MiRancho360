import type { ReactNode } from 'react';
import { useState } from 'react';
import { SideMenu } from './SideMenu';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  useSideMenu?: boolean;
  currentPage?: string;
  headerActions?: ReactNode;
}

export function Layout({
  children,
  title,
  showBackButton = false,
  onBack,
  useSideMenu = false,
  currentPage,
  headerActions
}: LayoutProps) {
  const [showMenu, setShowMenu] = useState(false);

  if (useSideMenu) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors shadow-sm"
              aria-label="Abrir menú principal"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="flex-1 text-center text-xl font-bold text-slate-900">
              {title || 'MiRancho360'}
            </h1>
            <div className="flex w-24 justify-end gap-2">
              {headerActions ?? <div className="w-12" />}
            </div>
          </div>
        </header>

        <SideMenu
          isOpen={showMenu}
          onClose={() => setShowMenu(false)}
          currentPage={currentPage}
        />

        <main className="pt-24 pb-8">
          <div className="max-w-6xl mx-auto px-4">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header tradicional */}
      <header className="bg-white shadow-sm border-b border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {showBackButton && onBack && (
              <button
                onClick={onBack}
                className="btn-outline !min-h-12 !py-2 !px-4 !text-base text-primary-600 border-primary-300 hover:bg-primary-50"
                aria-label="Volver"
              >
                ← Volver
              </button>
            )}
            
            {title && (
              <h1 className="text-2xl font-bold text-primary-800 flex-1 text-center">
                {title}
              </h1>
            )}

            {!showBackButton && (
              <div className="text-center w-full">
                <h1 className="text-2xl font-bold text-ranch-600">
                  🐄 MiRancho360
                </h1>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}