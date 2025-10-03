import { useId } from 'react';
import type {
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react';

export type CardVariant = 'default' | 'primary' | 'warning' | 'danger' | 'success';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  variant?: CardVariant;
  children: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
  clickable?: boolean;
  onCardClick?: () => void;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white border-gray-200',
  primary: 'bg-primary-50 border-primary-300',
  warning: 'bg-yellow-50 border-yellow-300',
  danger: 'bg-red-50 border-red-300',
  success: 'bg-green-50 border-green-300',
};

function combineClasses(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(' ');
}

const ACTIVATION_KEYS = new Set(['Enter', ' ', 'Spacebar']);
const SPACE_KEYS = new Set([' ', 'Spacebar']);

export function Card({
  title,
  subtitle,
  variant = 'default',
  children,
  footer,
  icon,
  clickable = false,
  onCardClick,
  className = '',
  onClick: rawOnClick,
  onKeyDown: rawOnKeyDown,
  onKeyUp: rawOnKeyUp,
  role: roleProp,
  tabIndex: tabIndexProp,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: CardProps) {
  const cardId = useId();
  const headingId = title ? `${cardId}-title` : undefined;
  const subtitleId = subtitle ? `${cardId}-subtitle` : undefined;

  const role = clickable ? 'button' : roleProp;
  const tabIndex = clickable ? 0 : tabIndexProp;
  const labelledBy = clickable
    ? ariaLabelledBy ?? headingId
    : ariaLabelledBy;
  const describedBy = clickable
    ? ariaDescribedBy ?? subtitleId
    : ariaDescribedBy;

  const hasClickHandler = clickable || typeof rawOnClick === 'function';
  const hasKeyDownHandler = clickable || typeof rawOnKeyDown === 'function';
  const hasKeyUpHandler = clickable || typeof rawOnKeyUp === 'function';

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (clickable) {
      onCardClick?.();
    }
    rawOnClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const isActivationKey = clickable && ACTIVATION_KEYS.has(event.key);

    if (isActivationKey && event.repeat) {
      rawOnKeyDown?.(event);
      return;
    }

    if (isActivationKey) {
      if (event.key === 'Enter') {
        event.preventDefault();
        onCardClick?.();
      }

      if (SPACE_KEYS.has(event.key)) {
        event.preventDefault();
      }
    }

    rawOnKeyDown?.(event);
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
    const isSpaceActivation = clickable && SPACE_KEYS.has(event.key);

    if (isSpaceActivation) {
      event.preventDefault();
      onCardClick?.();
    }

    rawOnKeyUp?.(event);
  };

  const hasHeaderContent = Boolean(title || subtitle || icon);

  return (
    <div
      data-variant={variant}
      data-clickable={clickable || undefined}
      className={combineClasses(
        'group relative flex flex-col rounded-2xl border shadow-lg transition-shadow focus-visible:outline-none',
        'bg-white text-slate-900',
        variantClasses[variant],
        clickable
          ? 'cursor-pointer hover:shadow-xl focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background-light tap-highlight-none'
          : '',
        className
      )}
      role={role}
      tabIndex={tabIndex}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onClick={hasClickHandler ? handleClick : undefined}
      onKeyDown={hasKeyDownHandler ? handleKeyDown : undefined}
      onKeyUp={hasKeyUpHandler ? handleKeyUp : undefined}
      {...rest}
    >
      {hasHeaderContent && (
        <div className="flex items-start justify-between px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-6">
          <div className="flex flex-1 items-start gap-3">
            {icon && (
              <span className="text-3xl" aria-hidden="true">
                {icon}
              </span>
            )}
            <div className="space-y-1">
              {title && (
                <h3
                  id={headingId}
                  className="text-xl font-bold leading-tight text-slate-900 sm:text-2xl"
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p
                  id={subtitleId}
                  className="text-base text-slate-600 sm:text-lg"
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div
        className={combineClasses(
          'px-4 pb-4 sm:px-6 sm:pb-6',
          hasHeaderContent ? 'pt-2 sm:pt-2' : 'pt-4 sm:pt-6'
        )}
      >
        {children}
      </div>

      {footer && (
        <div className="border-t border-gray-200 bg-background-light/70 px-4 py-4 sm:px-6 sm:py-5">
          {footer}
        </div>
      )}
    </div>
  );
}
