import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnimalsListPage } from './pages/AnimalsListPage';
import { AnimalFormPage } from './pages/AnimalFormPage';
import { SitesPage } from './pages/SitesPage';

// Componente para rutas protegidas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { usuario, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ranch-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Componente para rutas públicas (solo cuando no está autenticado)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { usuario, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ranch-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (usuario) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Ruta por defecto */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Rutas públicas */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            
            {/* Rutas protegidas */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Rutas de animales */}
            <Route 
              path="/animales" 
              element={
                <ProtectedRoute>
                  <AnimalsListPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Formulario crear animal */}
            <Route 
              path="/animales/nuevo" 
              element={
                <ProtectedRoute>
                  <AnimalFormPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Formulario editar animal */}
            <Route 
              path="/animales/:id/editar" 
              element={
                <ProtectedRoute>
                  <AnimalFormPage />
                </ProtectedRoute>
              } 
            />

            {/* Vista detalle animal (pendiente de implementar) */}
            <Route 
              path="/animales/:id" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">🐄 Vista Detalle Animal</h1>
                      <p className="text-gray-600">Próximamente disponible</p>
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />

            {/* Rutas de sitios */}
            <Route 
              path="/sitios" 
              element={
                <ProtectedRoute>
                  <SitesPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Rutas de sitios (por implementar) */}
            <Route 
              path="/sitios" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">🌳 Módulo de Sitios</h1>
                      <p className="text-gray-600">Próximamente disponible</p>
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta 404 */}
            <Route 
              path="*" 
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-6">Página no encontrada</p>
                    <a href="/dashboard" className="btn-primary">
                      Volver al inicio
                    </a>
                  </div>
                </div>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
