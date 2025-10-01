import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnimalsListPage } from './pages/AnimalsListPage';
import { AnimalFormPage } from './pages/AnimalFormPage';
import { AnimalProfilePage } from './pages/AnimalProfilePage';
import { SitesPage } from './pages/SitesPage';
import { RemindersPage } from './pages/RemindersPage';
import { ReproductivePage } from './pages/ReproductivePage';

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
            
            {/* Rutas de animales - Usando rutas anidadas para Modal Route Pattern */}
            <Route 
              path="/animales" 
              element={
                <ProtectedRoute>
                  <AnimalsListPage />
                </ProtectedRoute>
              }
            >
              {/* Ruta anidada: El perfil se renderiza SOBRE la lista */}
              <Route 
                path=":id" 
                element={<AnimalProfilePage />} 
              />
            </Route>
            
            {/* Formulario crear animal - Ruta independiente */}
            <Route 
              path="/animales/nuevo" 
              element={
                <ProtectedRoute>
                  <AnimalFormPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Formulario editar animal - Ruta independiente */}
            <Route 
              path="/animales/:id/editar" 
              element={
                <ProtectedRoute>
                  <AnimalFormPage />
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

            {/* Rutas de recordatorios */}
            <Route 
              path="/recordatorios" 
              element={
                <ProtectedRoute>
                  <RemindersPage />
                </ProtectedRoute>
              } 
            />

            {/* Rutas de reproducción */}
            <Route 
              path="/reproduccion" 
              element={
                <ProtectedRoute>
                  <ReproductivePage />
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
