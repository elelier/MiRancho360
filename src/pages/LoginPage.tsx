import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 Formulario enviado con PIN:', pin);
    
    if (pin.length !== 4) {
      setError('El PIN debe tener 4 dígitos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('🔄 Intentando login...');
      const success = await login(pin);
      console.log('🎯 Resultado del login:', success);
      
      if (success) {
        console.log('✅ Login exitoso, navegando al dashboard...');
        navigate('/dashboard');
      } else {
        console.log('❌ Login fallido');
        setError('PIN incorrecto. Intenta de nuevo.');
        setPin('');
      }
    } catch (error) {
      console.error('💥 Error en handleSubmit:', error);
      setError('Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(value);
    setError('');
  };

  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🐄</div>
          <h1 className="text-3xl font-bold text-primary-800 mb-2">MiRancho360</h1>
          <p className="text-lg text-primary-600">Administra tu rancho familiar</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-primary-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-primary-800">Iniciar Sesión</h2>
              <p className="text-primary-600 mt-2">Ingresa tu PIN de 4 dígitos</p>
            </div>

            <Input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={handlePinChange}
              placeholder="••••"
              maxLength={4}
              className="text-center text-2xl tracking-wider border-primary-300 focus:border-primary-500 focus:ring-primary-500"
              error={error}
              autoFocus
              required
            />

            <Button
              type="submit"
              size="large"
              fullWidth
              isLoading={isLoading}
              disabled={pin.length !== 4}
              className="bg-primary-400 hover:bg-primary-500 text-white !text-lg !py-4 disabled:bg-primary-200"
            >
              {isLoading ? 'Verificando...' : 'Ingresar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-primary-500">
              ¿Primera vez? Contacta al administrador para obtener tu PIN
            </p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-6 text-sm text-primary-600">
            <span>🔒 Seguro</span>
            <span>📱 Mobile-First</span>
            <span>🌐 Offline Ready</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}