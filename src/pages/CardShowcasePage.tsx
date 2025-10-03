import { useState, type ReactNode } from 'react';
import { Activity, BellRing, CheckCircle2, HeartPulse, ShieldAlert } from 'lucide-react';
import { Card, type CardVariant } from '../components/common/Card';
import { LargeButton } from '../components/common/LargeButton';

const clickableShowcase: Array<{
  title: string;
  subtitle: string;
  variant: CardVariant;
  icon: ReactNode;
  metric: string;
  description: string;
  actionLabel: string;
}> = [
  {
    title: 'Salud',
    subtitle: 'Monitoreo en tiempo real',
    variant: 'primary',
    icon: <HeartPulse className="h-8 w-8" aria-hidden="true" />,
    metric: '3 alertas activas',
    description: 'Animales con seguimiento veterinario pendiente.',
    actionLabel: 'Ir a Salud',
  },
  {
    title: 'Partos proximos',
    subtitle: 'Ventana de 7 dias',
    variant: 'warning',
    icon: <BellRing className="h-8 w-8" aria-hidden="true" />,
    metric: '2 proximos eventos',
    description: 'Asegura preparar corrales y equipo de apoyo.',
    actionLabel: 'Planificar partos',
  },
  {
    title: 'Alertas criticas',
    subtitle: 'Atencion prioritaria',
    variant: 'danger',
    icon: <ShieldAlert className="h-8 w-8" aria-hidden="true" />,
    metric: '1 caso urgente',
    description: 'Requiere intervencion inmediata del personal.',
    actionLabel: 'Ver detalle',
  },
];

const informationalShowcase: Array<{
  title: string;
  subtitle?: string;
  variant: CardVariant;
  icon?: ReactNode;
  body: ReactNode;
}> = [
  {
    title: 'Inventario general',
    subtitle: 'Resumen diario',
    variant: 'default',
    icon: <Activity className="h-8 w-8" aria-hidden="true" />,
    body: (
      <ul className="space-y-1 text-sm text-gray-600">
        <li><strong>24</strong> animales activos</li>
        <li><strong>6</strong> sitios monitoreados</li>
        <li><strong>12</strong> recordatorios programados</li>
      </ul>
    ),
  },
  {
    title: 'Registro concluido',
    subtitle: 'Ultima accion',
    variant: 'success',
    icon: <CheckCircle2 className="h-8 w-8" aria-hidden="true" />,
    body: (
      <div className="space-y-2 text-sm text-gray-600">
        <p>El nuevo parto fue registrado y archivado correctamente.</p>
        <p className="text-xs text-gray-500">Actualizado hace 12 minutos.</p>
      </div>
    ),
  },
];

export function CardShowcasePage() {
  const [lastInteraction, setLastInteraction] = useState<string>('Selecciona una tarjeta para ver la accion.');

  return (
    <div className="min-h-screen bg-background-light py-10 px-6">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Demo</p>
          <h1 className="text-4xl font-bold text-gray-900">Card Playground</h1>
          <p className="max-w-3xl text-lg text-gray-600">
            Explora las variantes del componente <code className="rounded bg-gray-100 px-1">Card</code>, incluyendo configuraciones
            clicables y de solo lectura. Usa este entorno para validar jerarquias visuales, contraste y comportamiento accesible.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Tarjetas clicables</h2>
              <p className="text-sm text-gray-600">
                Cada tarjeta usa <code className="rounded bg-gray-100 px-1">clickable</code> y `onCardClick`. El texto inferior muestra la ultima interaccion.
              </p>
            </div>
            <div className="rounded-xl border border-primary-100 bg-primary-50/60 px-4 py-3 text-sm text-primary-900">
              {lastInteraction}
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {clickableShowcase.map(({ title, subtitle, variant, icon, metric, description, actionLabel }) => (
              <Card
                key={variant}
                title={title}
                subtitle={subtitle}
                variant={variant}
                icon={icon}
                clickable
                onCardClick={() => setLastInteraction(`Accion disparada desde "${title}".`)}
                footer={
                  <LargeButton variant={variant === 'danger' ? 'danger' : 'primary'} size="large">
                    {actionLabel}
                  </LargeButton>
                }
              >
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="text-xl font-semibold text-gray-900">{metric}</p>
                  <p>{description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">Tarjetas informativas</h2>
          <p className="text-sm text-gray-600">
            Ejemplos sin interactividad para resumenes, KPI y estados finales. Ajusta contenido, iconos o footers segun el caso de uso.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {informationalShowcase.map(({ title, subtitle, variant, icon, body }) => (
              <Card key={variant} title={title} subtitle={subtitle} variant={variant} icon={icon}>
                {body}
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
