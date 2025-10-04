import type { CSSProperties, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const ACTION_WIDTH = 88;
const ANIMATION_DURATION = 280;

type SwipeSide = 'left' | 'right' | null;

type SwipeActionIntent = 'default' | 'edit' | 'delete';

export interface SwipeActionItem {
  id: string;
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  ariaLabel?: string;
  intent?: SwipeActionIntent;
  className?: string;
}

export interface SwipeActionProps {
  children: ReactNode;
  leftActions?: SwipeActionItem[];
  rightActions?: SwipeActionItem[];
  className?: string;
  actionWidth?: number;
  onOpenChange?: (side: SwipeSide) => void;
  moreButtonLabel?: string;
}

const intentClasses: Record<SwipeActionIntent, string> = {
  default: 'bg-primary-600 hover:bg-primary-700 text-white',
  edit: 'bg-blue-600 hover:bg-blue-700 text-white',
  delete: 'bg-red-600 hover:bg-red-700 text-white'
};

function getActionClasses(intent: SwipeActionIntent, custom?: string) {
  const baseClasses = 'flex items-center justify-center gap-2 px-4 text-base font-semibold min-w-[72px] min-h-[44px] '
    + 'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/80 text-white';

  return [baseClasses, intentClasses[intent], custom].filter(Boolean).join(' ');
}

export function SwipeAction({
  children,
  leftActions = [],
  rightActions = [],
  className = '',
  actionWidth = ACTION_WIDTH,
  onOpenChange,
  moreButtonLabel = 'Acciones'
}: SwipeActionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [translate, setTranslate] = useState(0);
  const translateRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [openSide, setOpenSide] = useState<SwipeSide>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const startXRef = useRef(0);
  const startTranslateRef = useRef(0);
  const isDraggingRef = useRef(false);

  const totalLeftWidth = useMemo(() => leftActions.length * actionWidth, [leftActions, actionWidth]);
  const totalRightWidth = useMemo(() => rightActions.length * actionWidth, [rightActions, actionWidth]);

  const clampTranslate = useCallback((value: number) => {
    const min = -totalRightWidth;
    const max = totalLeftWidth;

    if (value < min) {
      return min;
    }

    if (value > max) {
      return max;
    }

    return value;
  }, [totalLeftWidth, totalRightWidth]);

  const setSide = useCallback((side: SwipeSide) => {
    setOpenSide(side);

    const nextTranslate = side === 'left'
      ? totalLeftWidth
      : side === 'right'
        ? -totalRightWidth
        : 0;

    translateRef.current = nextTranslate;
    setTranslate(nextTranslate);
    setIsMenuOpen(false);

    if (onOpenChange) {
      onOpenChange(side);
    }
  }, [onOpenChange, totalLeftWidth, totalRightWidth]);

  const close = useCallback(() => {
    setSide(null);
  }, [setSide]);

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.buttons !== 1) {
      return;
    }

    setIsDragging(true);
    isDraggingRef.current = true;
    startXRef.current = event.clientX;
    startTranslateRef.current = translateRef.current;

    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, []);

  const finishGesture = useCallback((currentTranslate: number) => {
    const hasLeft = totalLeftWidth > 0;
    const hasRight = totalRightWidth > 0;

    if (currentTranslate > 0 && hasLeft) {
      if (currentTranslate >= totalLeftWidth * 0.5) {
        setSide('left');
        return;
      }
    }

    if (currentTranslate < 0 && hasRight) {
      if (Math.abs(currentTranslate) >= totalRightWidth * 0.5) {
        setSide('right');
        return;
      }
    }

    close();
  }, [close, setSide, totalLeftWidth, totalRightWidth]);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) {
      return;
    }

    const delta = event.clientX - startXRef.current;
    const nextTranslate = clampTranslate(startTranslateRef.current + delta);

    if (Math.abs(delta) > 8) {
      event.preventDefault();
    }

    translateRef.current = nextTranslate;
    setTranslate(nextTranslate);
  }, [clampTranslate]);

  const handlePointerEnd = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) {
      return;
    }

    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setIsDragging(false);
    isDraggingRef.current = false;
    finishGesture(clampTranslate(translateRef.current));
  }, [clampTranslate, finishGesture, translateRef]);

  const handlePointerLeave = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) {
      return;
    }

    handlePointerEnd(event);
  }, [handlePointerEnd]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft' && leftActions.length > 0) {
      event.preventDefault();
      setSide('left');
      return;
    }

    if (event.key === 'ArrowRight' && rightActions.length > 0) {
      event.preventDefault();
      setSide('right');
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  }, [close, leftActions.length, rightActions.length, setSide]);

  useEffect(() => {
    if (!openSide && !isMenuOpen) {
      return;
    }

    const handlePointerDownOutside = (event: PointerEvent) => {
      if (!containerRef.current) {
        return;
      }

      const target = event.target as Node | null;

      if (target && !containerRef.current.contains(target)) {
        close();
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDownOutside);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDownOutside);
    };
  }, [close, isMenuOpen, openSide]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDownOutside = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDownOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDownOutside);
    };
  }, [isMenuOpen]);

  const actionStyle: CSSProperties = useMemo(() => ({ width: `${actionWidth}px` }), [actionWidth]);

  const contentStyle: CSSProperties = useMemo(() => ({
    transform: `translateX(${translate}px)`,
    transition: isDragging ? 'none' : `transform ${ANIMATION_DURATION}ms ease`,
    touchAction: 'pan-y'
  }), [isDragging, translate]);

  const renderAction = useCallback((action: SwipeActionItem) => {
    const intent = action.intent ?? 'default';
    const ariaLabel = action.ariaLabel ?? action.label;

    return (
      <button
        key={action.id}
        type="button"
        className={getActionClasses(intent, action.className)}
        style={actionStyle}
        onClick={() => {
          action.onPress();
          close();
        }}
        aria-label={ariaLabel}
      >
        {action.icon ? (
          <span aria-hidden className="text-xl">
            {action.icon}
          </span>
        ) : null}
        <span>{action.label}</span>
      </button>
    );
  }, [actionStyle, close]);

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden rounded-2xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary-400 ${className}`.trim()}
      data-component="swipe-action"
      data-open-side={openSide ?? ''}
    >
      <div className="absolute inset-y-0 left-0 flex" aria-hidden={leftActions.length === 0}>
        {leftActions.map(renderAction)}
      </div>

      <div className="absolute inset-y-0 right-0 flex" aria-hidden={rightActions.length === 0}>
        {rightActions.map(renderAction)}
      </div>

      <div
        role="group"
        aria-roledescription="Swipeable item"
        tabIndex={0}
        data-slot="content"
        className="relative z-10 cursor-pointer select-none"
        style={contentStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onPointerLeave={handlePointerLeave}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>

      {(leftActions.length > 0 || rightActions.length > 0) && (
        <div className="pointer-events-none absolute right-3 top-3 z-20 flex flex-col items-end gap-2">
          <button
            type="button"
            className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-600 text-white opacity-0 transition-opacity duration-200 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 group-hover:opacity-100"
            aria-label={moreButtonLabel}
            title={moreButtonLabel}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            <span aria-hidden className="text-2xl">⋮</span>
          </button>

          {isMenuOpen && (
            <div
              role="menu"
              className="pointer-events-auto mt-2 flex min-w-[180px] flex-col gap-1 rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5"
            >
              {[...leftActions, ...rightActions].map((action) => (
                <button
                  key={`menu-${action.id}`}
                  type="button"
                  role="menuitem"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-base font-medium text-primary-900 hover:bg-primary-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  onClick={() => {
                    action.onPress();
                    setIsMenuOpen(false);
                    close();
                  }}
                >
                  {action.icon ? (
                    <span aria-hidden className="text-xl text-primary-700">
                      {action.icon}
                    </span>
                  ) : null}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
