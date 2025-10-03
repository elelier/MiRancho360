import { useMemo, useState } from 'react';
import { CheckCircle2, Info, Loader2, Lock, Mail, User, Waves } from 'lucide-react';
import { Input, Select, Textarea } from '../components/common/Input';

const sexOptions = [
  { value: 'h', label: 'Hembra' },
  { value: 'm', label: 'Macho' },
  { value: 'c', label: 'Castrado' },
];

const statusOptions = [
  { value: 'en-revision', label: 'En revisión' },
  { value: 'completo', label: 'Completo' },
  { value: 'incompleto', label: 'Incompleto', disabled: true },
];

export function InputShowcasePage() {
  const [rancho, setRancho] = useState('');
  const [email, setEmail] = useState('');
  const [sexo, setSexo] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const emailError = useMemo(() => {
    if (!email) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? '' : 'Formato de correo inválido';
  }, [email]);

  const ranchoSuccess = rancho.trim().length >= 3 ? 'Nombre válido' : '';
  const comentariosSuccess = comentarios.trim().length >= 10 ? 'Se ve bien, puedes guardar' : '';

  return (
    <div className="min-h-screen bg-background-light py-10 px-6">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Demo</p>
          <h1 className="text-4xl font-bold text-gray-900">Input Playground</h1>
          <p className="max-w-3xl text-lg text-gray-600">
            Prueba cada estado disponible para <code className="rounded bg-gray-100 px-1">Input</code>, <code className="rounded bg-gray-100 px-1">Select</code> y <code className="rounded bg-gray-100 px-1">Textarea</code>.
            Utiliza este espacio para validar copy, accesibilidad y estilos antes de llevarlos a las pantallas del producto.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">Estados principales</h2>
          <p className="text-sm text-gray-600">Cada ejemplo muestra un estado independiente, ideal para revisiones rápidas de estilo y contraste.</p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Input label="Nombre del rancho" required placeholder="Ej: Rancho La Esperanza" helperText="El nombre aparecerá en todos tus reportes" />
            <Input label="Correo de contacto" type="email" error="Formato inválido" leftIcon={<Mail aria-hidden="true" />} defaultValue="mirancho@" />
            <Input label="Responsable" success="Información validada" rightIcon={<CheckCircle2 aria-hidden="true" />} defaultValue="María Gómez" />
            <Input label="Campo deshabilitado" value="ID-2025-0007" readOnly disabled leftIcon={<Lock aria-hidden="true" />} />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">Select y Textarea</h2>
            <p className="text-sm text-gray-600">Los mismos estados aplican a los otros controles para mantener consistencia visual.</p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Select label="Estado del registro" placeholder="Selecciona un estado" options={statusOptions} helperText="Los estados bloqueados aparecerán en gris." />
            <Select label="Sexo" required options={sexOptions} success="Selección guardada" defaultValue="h" />
            <Textarea label="Notas internas" helperText="Visible sólo para el equipo" rows={4} placeholder="Ej: Pendiente visita veterinaria" />
            <Textarea label="Historia clínica" error="Debes describir el tratamiento" rows={4} defaultValue="Tratamiento" />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-900">Formulario interactivo</h2>
              <p className="text-sm text-gray-600">Rellena los campos para observar cómo cambia el feedback en vivo.</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-900">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Los mensajes aparecen automáticamente según la validación.</span>
            </div>
          </div>

          <form className="mt-6 grid gap-6 md:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
            <Input
              label="Nombre del rancho"
              required
              value={rancho}
              onChange={(event) => setRancho(event.target.value)}
              leftIcon={<User aria-hidden="true" />}
              success={ranchoSuccess}
            />

            <Input
              label="Correo de contacto"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={emailError}
              leftIcon={<Mail aria-hidden="true" />}
              helperText={!email ? 'Usaremos este correo para recordatorios.' : undefined}
            />

            <Select
              label="Sexo del ejemplar"
              options={sexOptions}
              value={sexo}
              onChange={(event) => setSexo(event.target.value)}
              placeholder="Selecciona una opción"
              success={sexo ? 'Selección válida' : ''}
            />

            <Textarea
              label="Comentarios adicionales"
              rows={4}
              value={comentarios}
              onChange={(event) => setComentarios(event.target.value)}
              helperText="Describe señales visibles o comportamiento reciente."
              success={comentariosSuccess}
            />

            <Textarea
              label="Observaciones privadas"
              rows={4}
              value={observaciones}
              onChange={(event) => setObservaciones(event.target.value)}
              placeholder="Sólo será visible para tu equipo"
              helperText="20-200 caracteres recomendados"
            />

            <div className="space-y-4 rounded-xl border border-dashed border-primary-200 p-4 text-sm text-primary-900">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5" aria-hidden="true" />
                <p>
                  Los campos requeridos muestran el indicador <span className="font-semibold">*</span> y, si no defines placeholder, aparece la leyenda
                  <span className="font-semibold"> Campo requerido *</span> automáticamente.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Waves className="mt-0.5 h-5 w-5" aria-hidden="true" />
                <p>Utiliza los mensajes de éxito para confirmar guardados o validaciones remotas sin recargar la página.</p>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default InputShowcasePage;
