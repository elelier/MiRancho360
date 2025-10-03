import { useState } from 'react';
import { ArrowRight, Check, ShieldAlert, Sparkles } from 'lucide-react';
import { LargeButton } from '../components/common/LargeButton';

const variants: Array<{ label: string; variant: 'primary' | 'secondary' | 'danger' | 'success' }> = [
  { label: 'Primary', variant: 'primary' },
  { label: 'Secondary', variant: 'secondary' },
  { label: 'Danger', variant: 'danger' },
  { label: 'Success', variant: 'success' },
];

const sizes: Array<{ label: string; size: 'large' | 'xl' }> = [
  { label: 'Large (48px)', size: 'large' },
  { label: 'XL (60px)', size: 'xl' },
];

export function LargeButtonShowcasePage() {
  const [demoLoading, setDemoLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background-light py-10 px-6">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Demo</p>
          <h1 className="text-4xl font-bold text-gray-900">LargeButton Playground</h1>
          <p className="max-w-3xl text-lg text-gray-600">
            Usa esta vista para validar las variantes, tamaños y estados del componente <code className="rounded bg-gray-100 px-1">LargeButton</code>.
            Todos los ejemplos se renderizan con los estilos finales, incluyendo estados de foco accesibles.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Estados</h2>
              <p className="text-sm text-gray-600">Activa el modo de carga para revisar la animación y el bloqueo de interacción.</p>
            </div>
            <LargeButton
              variant="secondary"
              size="large"
              icon={<Sparkles className="h-6 w-6" aria-hidden="true" />}
              onClick={() => setDemoLoading((prev) => !prev)}
            >
              {demoLoading ? 'Desactivar loading' : 'Activar loading'}
            </LargeButton>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <LargeButton variant="primary" isLoading={demoLoading}>
              Continuar
            </LargeButton>
            <LargeButton variant="danger" isLoading={demoLoading}>
              Eliminar registro
            </LargeButton>
            <LargeButton variant="success" disabled>
              Aprobado (Disabled)
            </LargeButton>
            <LargeButton variant="secondary" icon={<Check className="h-6 w-6" aria-hidden="true" />} iconPosition="right">
              Confirmar acción
            </LargeButton>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">Variantes</h2>
          <p className="text-sm text-gray-600">Colores alineados a la paleta Rancho Natural. Hover y focus usan tonos adyacentes para cumplir WCAG.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {variants.map(({ label, variant }) => (
              <LargeButton
                key={variant}
                variant={variant}
                icon={<ArrowRight className="h-6 w-6" aria-hidden="true" />}
              >
                {label}
              </LargeButton>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">Tamaños</h2>
          <p className="text-sm text-gray-600">El tamaño <code className="rounded bg-gray-100 px-1">large</code> cumple 48px mínimos y <code className="rounded bg-gray-100 px-1">xl</code> se expande a 60px para CTA principales.</p>
          <div className="mt-6 grid gap-6">
            {sizes.map(({ label, size }) => (
              <div key={size} className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-500">{label}</span>
                <LargeButton size={size} variant="primary">
                  Reservar visita
                </LargeButton>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">Iconos</h2>
          <p className="text-sm text-gray-600">Los iconos respetan el espacio mínimo y se alinean al centro en ambos lados.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <LargeButton
              variant="primary"
              icon={<ArrowRight className="h-6 w-6" aria-hidden="true" />}
            >
              Icono izquierda (default)
            </LargeButton>
            <LargeButton
              variant="primary"
              icon={<ShieldAlert className="h-6 w-6" aria-hidden="true" />}
              iconPosition="right"
            >
              Icono derecha
            </LargeButton>
          </div>
        </section>
      </div>
    </div>
  );
}
