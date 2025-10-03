import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { Input, Select, Textarea } from '../Input';

describe('Input', () => {
  it('renders error state with aria attributes', () => {
    render(<Input label="Correo" error="Correo inválido" />);

    const input = screen.getByLabelText('Correo');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Correo inválido');
  });

  it('renders success message and icon when provided', () => {
    render(<Input label="Nombre" success="Nombre válido" />);

    const message = screen.getByText('Nombre válido');
    expect(message).toHaveAttribute('role', 'status');
    expect(message.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('hides success message when error is present', () => {
    render(<Input label="Email" success="Todo bien" error="Correo inválido" />);

    expect(screen.queryByText('Todo bien')).toBeNull();
    expect(screen.getByRole('alert')).toHaveTextContent('Correo inválido');
  });

  it('adds placeholder hint when required without placeholder', () => {
    render(<Input label="Teléfono" required />);

    const input = screen.getByLabelText(/Teléfono/);
    expect(input).toHaveAttribute('placeholder', 'Campo requerido *');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('does not override custom placeholder when provided', () => {
    render(<Input label="Ciudad" required placeholder="Ingresa tu ciudad" />);

    expect(screen.getByPlaceholderText('Ingresa tu ciudad')).toBeInTheDocument();
  });

  it('includes disabled utility classes', () => {
    render(<Input label="Identificador" disabled />);

    const input = screen.getByLabelText('Identificador');
    expect(input).toBeDisabled();
    expect(input.className).toContain('disabled:bg-gray-100');
    expect(input.className).toContain('disabled:text-gray-600');
    expect(input.className).toContain('disabled:cursor-not-allowed');
  });
});

describe('Select', () => {
  const options = [
    { value: 'm', label: 'Macho' },
    { value: 'h', label: 'Hembra' },
  ];

  it('renders success message when provided', () => {
    render(<Select label="Sexo" options={options} success="Selección válida" />);

    expect(screen.getByText('Selección válida')).toBeInTheDocument();
  });

  it('shows required placeholder when necessary', async () => {
    render(<Select label="Estado" options={options} required />);

    const select = screen.getByLabelText(/Estado/);
    expect(select).toHaveAttribute('aria-required', 'true');

    await userEvent.selectOptions(select, 'm');
    expect((select as HTMLSelectElement).value).toBe('m');
  });

  it('includes disabled utility classes for select', () => {
    render(<Select label="Estado" options={options} disabled />);

    const select = screen.getByLabelText('Estado');
    expect(select).toBeDisabled();
    expect(select.className).toContain('disabled:bg-gray-100');
    expect(select.className).toContain('disabled:text-gray-600');
  });
});

describe('Textarea', () => {
  it('renders success message when provided', () => {
    render(<Textarea label="Notas" success="Descripción guardada" />);

    expect(screen.getByText('Descripción guardada')).toBeInTheDocument();
  });

  it('applies required placeholder when not provided', () => {
    render(<Textarea label="Comentarios" required />);

    const textarea = screen.getByLabelText(/Comentarios/);
    expect(textarea).toHaveAttribute('placeholder', 'Campo requerido *');
  });

  it('includes disabled utility classes for textarea', () => {
    render(<Textarea label="Observaciones" disabled />);

    const textarea = screen.getByLabelText('Observaciones');
    expect(textarea).toBeDisabled();
    expect(textarea.className).toContain('disabled:bg-gray-100');
    expect(textarea.className).toContain('disabled:text-gray-600');
  });
});

describe('Accessibility audits', () => {
  it('has no axe violations for combined controls', async () => {
    const { container } = render(
      <div>
        <Input label="Nombre" required success="Nombre válido" />
        <Input label="Correo" type="email" error="Correo inválido" />
        <Select
          label="Sexo"
          required
          options={[
            { value: 'm', label: 'Macho' },
            { value: 'h', label: 'Hembra' },
          ]}
        />
        <Textarea label="Notas" helperText="Describe la visita" />
      </div>
    );

    const results = await axe(container);
    expect(results.violations.length).toBe(0);
  });
});
