import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface LargeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'large' | 'xl';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<NonNullable<LargeButtonProps['variant']>, string> = {
  primary:
    'bg-primary-700 hover:bg-primary-800 text-white focus-visible:ring-primary-500',
  secondary:
    'bg-accent-400 hover:bg-accent-500 text-slate-900 focus-visible:ring-accent-600',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500',
  success: 'bg-green-600 hover:bg-green-700 text-white focus-visible:ring-green-500',
};

const sizeClasses: Record<NonNullable<LargeButtonProps['size']>, string> = {
  large: 'px-6 py-4 text-xl min-h-[48px] min-w-[48px]',
  xl: 'px-8 py-6 text-2xl min-h-[60px] min-w-[60px]',
};

const contentGapClasses: Record<NonNullable<LargeButtonProps['size']>, string> = {
  large: 'gap-3',
  xl: 'gap-4',
};

function combineClasses(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(' ');
}

export function LargeButton({
  children,
  variant = 'primary',
  size = 'large',
  icon,
  iconPosition = 'left',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}: LargeButtonProps) {
  const isInteractionDisabled = Boolean(disabled || isLoading);
  const showIconLeft = icon && iconPosition === 'left' && !isLoading;
  const showIconRight = icon && iconPosition === 'right' && !isLoading;

  const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-2xl transition-transform duration-200 ease-out tap-highlight-none active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-background-light shadow-md';

  const resolvedClassName = combineClasses(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    isInteractionDisabled ? 'opacity-50 cursor-not-allowed' : '',
    className
  );

  const spinner = (
    <svg
      className="h-7 w-7 animate-spin text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      type={type}
      className={resolvedClassName}
      disabled={isInteractionDisabled}
      aria-disabled={isInteractionDisabled}
      aria-busy={isLoading || undefined}
      data-variant={variant}
      data-size={size}
      data-loading={isLoading || undefined}
      {...props}
    >
      <span
        data-slot="content"
        className={combineClasses('flex w-full items-center justify-center', contentGapClasses[size])}
      >
        {(isLoading || showIconLeft) && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center" aria-hidden="true">
            {isLoading ? spinner : icon}
          </span>
        )}
        <span className="flex-1 text-center leading-tight">
          <span className="block">
            {children}
          </span>
        </span>
        {showIconRight && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center" aria-hidden="true">
            {icon}
          </span>
        )}
      </span>
      {isLoading && (
        <span className="sr-only" role="status" aria-live="polite">
          Cargando
        </span>
      )}
    </button>
  );
}
