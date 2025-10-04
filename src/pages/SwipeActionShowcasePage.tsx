import { useMemo, useState } from 'react';
import {
  CalendarDays,
  ClipboardList,
  Edit3,
  Flag,
  MessageCircle,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { SwipeAction, type SwipeActionItem } from '../components/common';

interface ReminderItem {
  id: string;
  title: string;
  description: string;
  status: 'pendiente' | 'programado' | 'atendido';
  scheduledFor: string;
}

const reminderItems: ReminderItem[] = [
  {
    id: 'r1',
    title: 'Revisión veterinaria',
    description: 'Chequeo clínico para #A-102 (Vaca Holstein)',
    status: 'pendiente',
    scheduledFor: 'Hoy 15:30',
  },
  {
    id: 'r2',
    title: 'Vacunación aftosa',
    description: 'Aplicar lote 2024-A al hato joven',
    status: 'programado',
    scheduledFor: 'Mañana 09:00',
  },
  {
    id: 'r3',
    title: 'Registro de parto',
    description: 'Capturar datos recién nacidos del lote 12',
    status: 'atendido',
    scheduledFor: 'Ayer 18:45',
  },
];

const statusStyles: Record<ReminderItem['status'], string> = {
  pendiente: 'bg-orange-100 text-orange-700 border-orange-200',
  programado: 'bg-blue-100 text-blue-700 border-blue-200',
  atendido: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export function SwipeActionShowcasePage() {
  const [log, setLog] = useState<string[]>(['Interactúa con las filas para ver las acciones ejecutadas.']);
  const [openedId, setOpenedId] = useState<string | null>(null);

  const logAction = (message: string) => {
    setLog((current) => [message, ...current].slice(0, 5));
  };

  const createLeftActions = (item: ReminderItem): SwipeActionItem[] => [
    {
      id: `${item.id}-edit`,
      label: 'Editar',
      intent: 'edit',
      icon: <Edit3 className="h-5 w-5" aria-hidden="true" />,
      onPress: () => {
        logAction(`Editar programado para "${item.title}".`);
      },
    },
    {
      id: `${item.id}-note`,
      label: 'Anotar',
      icon: <ClipboardList className="h-5 w-5" aria-hidden="true" />,
      onPress: () => {
        logAction(`Se añadió una nota rápida a "${item.title}".`);
      },
    },
  ];

  const createRightActions = (item: ReminderItem): SwipeActionItem[] => {
    const right: SwipeActionItem[] = [
      {
        id: `${item.id}-flag`,
        label: 'Priorizar',
        icon: <Flag className="h-5 w-5" aria-hidden="true" />,
        onPress: () => {
          logAction(`"${item.title}" marcado como prioritario.`);
        },
      },
      {
        id: `${item.id}-delete`,
        label: 'Eliminar',
        intent: 'delete',
        icon: <Trash2 className="h-5 w-5" aria-hidden="true" />,
        onPress: () => {
          logAction(`Recordatorio eliminado: "${item.title}".`);
        },
      },
    ];

    if (item.status !== 'atendido') {
      right.unshift({
        id: `${item.id}-done`,
        label: 'Completar',
        icon: <ShieldAlert className="h-5 w-5" aria-hidden="true" />,
        onPress: () => {
          logAction(`"${item.title}" se marcó como atendido.`);
        },
      });
    }

    return right;
  };

  const actionSummary = useMemo(() => {
    if (!openedId) {
      return 'Ninguna fila abierta.';
    }

    const item = reminderItems.find(({ id }) => id === openedId);
    if (!item) {
      return 'Fila cerrada.';
    }

    return `Acciones visibles para "${item.title}".`;
  }, [openedId]);

  return (
    <div className="min-h-screen bg-background-light py-10 px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Demo</p>
          <h1 className="text-4xl font-bold text-gray-900">Swipe Action Playground</h1>
          <p className="max-w-3xl text-lg text-gray-600">
            Practica los gestos de deslizamiento, la navegación por teclado y el menú contextual del componente
            <code className="mx-1 rounded bg-gray-100 px-1">SwipeAction</code>. Ideal para validar combinaciones de
            acciones antes de integrarlo en listados reales.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Recordatorios interactivos</h2>
              <p className="text-sm text-gray-600">
                Desliza hacia los lados o usa <kbd className="rounded border border-gray-300 px-1">←</kbd>
                <kbd className="ml-1 rounded border border-gray-300 px-1">→</kbd> sobre cada fila para descubrir las
                acciones. Presiona <kbd className="ml-1 rounded border border-gray-300 px-1">Esc</kbd> para cerrar.
              </p>
            </div>
            <div className="rounded-xl border border-primary-100 bg-primary-50/70 px-4 py-3 text-sm text-primary-900">
              {actionSummary}
            </div>
          </div>

          <div className="mt-6 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-gray-50">
            {reminderItems.map((item) => (
              <SwipeAction
                key={item.id}
                className="bg-white"
                leftActions={createLeftActions(item)}
                rightActions={createRightActions(item)}
                onOpenChange={(side) => {
                  setOpenedId(side ? item.id : null);
                }}
              >
                <article className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    <CalendarDays className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status]}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-xs font-medium text-primary-700">{item.scheduledFor}</p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3 py-1 text-sm font-medium text-primary-700 shadow-sm transition hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    onClick={() => logAction(`Se envió mensaje interno sobre "${item.title}".`)}
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Mensaje
                  </button>
                </article>
              </SwipeAction>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">Fallback para escritorio</h2>
            <p className="text-sm text-gray-600">
              En pantallas grandes, el botón flotante "Acciones" ofrece un menú contextual accesible con todas las opciones
              disponibles. Interactúa con teclado o mouse para probarlo.
            </p>
            <div className="mt-4 space-y-3">
              <SwipeAction
                className="bg-white"
                rightActions={[
                  {
                    id: 'draft-edit',
                    label: 'Editar borrador',
                    intent: 'edit',
                    icon: <Edit3 className="h-5 w-5" aria-hidden="true" />,
                    onPress: () => logAction('Se abrió la edición del borrador.'),
                  },
                  {
                    id: 'draft-delete',
                    label: 'Descartar',
                    intent: 'delete',
                    icon: <Trash2 className="h-5 w-5" aria-hidden="true" />,
                    onPress: () => logAction('Borrador descartado.'),
                  },
                ]}
                leftActions={[
                  {
                    id: 'draft-share',
                    label: 'Compartir',
                    icon: <MessageCircle className="h-5 w-5" aria-hidden="true" />,
                    onPress: () => logAction('Se compartió el borrador por mensaje.'),
                  },
                ]}
                moreButtonLabel="Ver acciones del borrador"
              >
                <article className="rounded-xl border border-dashed border-primary-200 bg-primary-50/70 px-5 py-6">
                  <h3 className="text-lg font-semibold text-primary-900">Plantilla de checklist diaria</h3>
                  <p className="mt-2 text-sm text-primary-700">
                    Esta sección demuestra el botón "Acciones" que aparece al pasar el mouse o enfocar el elemento con teclado.
                  </p>
                </article>
              </SwipeAction>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">Registro de interacción</h2>
            <p className="text-sm text-gray-600">
              Se listan las últimas acciones ejecutadas para validar la integración con callbacks reales.
            </p>
            <ul className="mt-4 space-y-2">
              {log.map((entry, index) => (
                <li
                  key={`${entry}-${index}`}
                  className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
                >
                  <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-primary-500" aria-hidden="true" />
                  {entry}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SwipeActionShowcasePage;
