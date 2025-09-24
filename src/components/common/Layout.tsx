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
}

export function Layout({ 
  children, 
  title, 
  showBackButton = false, 
  onBack, 
  useSideMenu = false,
  currentPage 
}: LayoutProps) {
  const [showMenu, setShowMenu] = useState(false);

  if (useSideMenu) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header con menú hamburguesa */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between p-6">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-4 rounded-xl hover:bg-primary-50 transition-colors min-w-[60px] min-h-[60px] flex items-center justify-center"
              aria-label="Abrir menú principal"
            >
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-primary-800">{title || 'MiRancho360'}</h1>
            <div className="w-16"></div> {/* Spacer */}
          </div>
        </header>

        {/* Menu lateral */}
        <SideMenu 
          isOpen={showMenu} 
          onClose={() => setShowMenu(false)}
          currentPage={currentPage}
        />

        {/* Main Content */}
        <main className="p-6">
          {children}
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