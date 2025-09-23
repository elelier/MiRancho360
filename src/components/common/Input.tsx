import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={inputId} className="block text-lg font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
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
          className={`
            input-primary
            ${leftIcon ? 'pl-12' : ''}
            ${rightIcon ? 'pr-12' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-gray-400 text-xl">{rightIcon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-lg text-red-600">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-base text-gray-500">
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
  helperText?: string;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export function Select({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  id,
  options,
  placeholder,
  ...props
}: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={selectId} className="block text-lg font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={selectId}
        className={`
          input-primary
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-2 text-lg text-red-600">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-base text-gray-500">
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
  helperText?: string;
  fullWidth?: boolean;
  rows?: number;
}

export function Textarea({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  id,
  rows = 4,
  ...props
}: TextareaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={textareaId} className="block text-lg font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        id={textareaId}
        rows={rows}
        className={`
          input-primary
          resize-vertical
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      />
      
      {error && (
        <p className="mt-2 text-lg text-red-600">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-base text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}