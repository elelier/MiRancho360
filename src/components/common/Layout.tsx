import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function Layout({ children, title, showBackButton = false, onBack }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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