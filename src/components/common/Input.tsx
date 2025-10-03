import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  success,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  id,
  placeholder,
  required,
  ...rest
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success) && !hasError;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = hasError ? `${inputId}-error` : undefined;
  const successId = hasSuccess ? `${inputId}-success` : undefined;
  const describedBy = [errorId, successId, helperId].filter(Boolean).join(' ') || undefined;
  const resolvedPlaceholder = placeholder ?? (required ? 'Campo requerido *' : undefined);

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={inputId} className="block text-lg font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-400 text-xl">{leftIcon}</span>
          </div>
        )}
        
        <input
          id={inputId}
          required={required}
          aria-required={required ? true : undefined}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={describedBy}
          placeholder={resolvedPlaceholder}
          className={`
            input-primary
            placeholder:text-primary-300
            transition-colors
            duration-150
            focus:outline-none
            focus:ring-4
            focus:ring-primary-400/50
            focus:border-primary-500
            disabled:bg-gray-100
            disabled:text-gray-600
            disabled:cursor-not-allowed
            disabled:border-gray-300
            min-h-[60px]
            ${leftIcon ? 'pl-12' : ''}
            ${rightIcon ? 'pr-12' : ''}
            ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/70' : ''}
            ${hasSuccess ? 'border-green-600 focus:border-green-600 focus:ring-green-500/60' : ''}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          {...rest}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-gray-400 text-xl">{rightIcon}</span>
          </div>
        )}
      </div>
      
      {hasError && (
        <p id={errorId} role="alert" className="mt-2 text-lg text-red-600">
          {error}
        </p>
      )}
      
      {hasSuccess && (
        <p id={successId} role="status" className="mt-2 text-lg text-green-600 flex items-center">
          <span aria-hidden="true" className="mr-2 text-green-500">✓</span>
          {success}
        </p>
      )}

      {helperText && !hasError && !hasSuccess && (
        <p id={helperId} className="mt-2 text-base text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

// Componente para Select
interface SelectProps extends Omit<InputHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export function Select({
  label,
  error,
  success,
  helperText,
  fullWidth = true,
  className = '',
  id,
  options,
  placeholder,
  required,
  ...rest
}: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success) && !hasError;
  const helperId = helperText ? `${selectId}-helper` : undefined;
  const errorId = hasError ? `${selectId}-error` : undefined;
  const successId = hasSuccess ? `${selectId}-success` : undefined;
  const describedBy = [errorId, successId, helperId].filter(Boolean).join(' ') || undefined;
  const resolvedPlaceholder = placeholder ?? (required ? 'Selecciona una opción *' : undefined);

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={selectId} className="block text-lg font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={selectId}
        required={required}
        aria-required={required ? true : undefined}
        aria-invalid={hasError ? true : undefined}
        aria-describedby={describedBy}
        className={`
          input-primary
          placeholder:text-primary-300
          transition-colors
          duration-150
          focus:outline-none
          focus:ring-4
          focus:ring-primary-400/50
          focus:border-primary-500
          disabled:bg-gray-100
          disabled:text-gray-600
          disabled:cursor-not-allowed
          disabled:border-gray-300
          min-h-[60px]
          ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/70' : ''}
          ${hasSuccess ? 'border-green-600 focus:border-green-600 focus:ring-green-500/60' : ''}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...rest}
      >
        {resolvedPlaceholder && (
          <option value="" disabled>
            {resolvedPlaceholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      
      {hasError && (
        <p id={errorId} role="alert" className="mt-2 text-lg text-red-600">
          {error}
        </p>
      )}
      
      {hasSuccess && (
        <p id={successId} role="status" className="mt-2 text-lg text-green-600 flex items-center">
          <span aria-hidden="true" className="mr-2 text-green-500">✓</span>
          {success}
        </p>
      )}

      {helperText && !hasError && !hasSuccess && (
        <p id={helperId} className="mt-2 text-base text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

// Componente para Textarea
interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  fullWidth?: boolean;
  rows?: number;
}

export function Textarea({
  label,
  error,
  success,
  helperText,
  fullWidth = true,
  className = '',
  id,
  placeholder,
  required,
  rows = 4,
  ...rest
}: TextareaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success) && !hasError;
  const helperId = helperText ? `${textareaId}-helper` : undefined;
  const errorId = hasError ? `${textareaId}-error` : undefined;
  const successId = hasSuccess ? `${textareaId}-success` : undefined;
  const describedBy = [errorId, successId, helperId].filter(Boolean).join(' ') || undefined;
  const resolvedPlaceholder = placeholder ?? (required ? 'Campo requerido *' : undefined);

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={textareaId} className="block text-lg font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        id={textareaId}
        rows={rows}
        required={required}
        aria-required={required ? true : undefined}
        aria-invalid={hasError ? true : undefined}
        aria-describedby={describedBy}
        placeholder={resolvedPlaceholder}
        className={`
          input-primary
          resize-vertical
          placeholder:text-primary-300
          transition-colors
          duration-150
          focus:outline-none
          focus:ring-4
          focus:ring-primary-400/50
          focus:border-primary-500
          disabled:bg-gray-100
          disabled:text-gray-600
          disabled:cursor-not-allowed
          disabled:border-gray-300
          min-h-[60px]
          ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/70' : ''}
          ${hasSuccess ? 'border-green-600 focus:border-green-600 focus:ring-green-500/60' : ''}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...rest}
      />
      
      {hasError && (
        <p id={errorId} role="alert" className="mt-2 text-lg text-red-600">
          {error}
        </p>
      )}
      
      {hasSuccess && (
        <p id={successId} role="status" className="mt-2 text-lg text-green-600 flex items-center">
          <span aria-hidden="true" className="mr-2 text-green-500">✓</span>
          {success}
        </p>
      )}

      {helperText && !hasError && !hasSuccess && (
        <p id={helperId} className="mt-2 text-base text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
