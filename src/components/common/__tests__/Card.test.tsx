import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Card, type CardVariant } from '../Card';

describe('Card', () => {
  it('renders title, subtitle, children, and icon', () => {
    render(
      <Card title="Dashboard" subtitle="Resumen" icon={<span data-testid="icon">*</span>}>
        <p>Contenido</p>
      </Card>
    );

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByText('Resumen')).toBeInTheDocument();
    expect(screen.getByText('Contenido')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('exposes button semantics when clickable', () => {
    const handleClick = vi.fn();

    render(
      <Card clickable onCardClick={handleClick}>
        Content
      </Card>
    );

    const card = screen.getByRole('button');

    expect(card).toHaveAttribute('tabindex', '0');
    expect(card).toHaveAttribute('data-clickable');

    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(card, { key: ' ' });
    fireEvent.keyDown(card, { key: ' ', repeat: true });
    expect(handleClick).toHaveBeenCalledTimes(2);

    fireEvent.keyUp(card, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it('activates space key on keyup only once despite repeats', () => {
    const handleClick = vi.fn();

    render(
      <Card clickable onCardClick={handleClick}>
        Content
      </Card>
    );

    const card = screen.getByRole('button');

    fireEvent.keyDown(card, { key: ' ' });
    fireEvent.keyDown(card, { key: ' ', repeat: true });
    expect(handleClick).toHaveBeenCalledTimes(0);

    fireEvent.keyUp(card, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(1);

    fireEvent.keyUp(card, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it.each<[CardVariant, string[]]>([
    ['default', ['bg-white', 'border-gray-200']],
    ['primary', ['bg-primary-50', 'border-primary-300']],
    ['warning', ['bg-yellow-50', 'border-yellow-300']],
    ['danger', ['bg-red-50', 'border-red-300']],
    ['success', ['bg-green-50', 'border-green-300']],
  ])('applies %s variant styles', (variant, expectedClasses) => {
    const { container } = render(
      <Card variant={variant}>
        Content
      </Card>
    );

    const card = container.firstElementChild;

    expect(card).toHaveAttribute('data-variant', variant);
    expectedClasses.forEach((className) => {
      expect(card?.className).toContain(className);
    });
  });

  it('renders footer content when provided', () => {
    render(
      <Card footer={<button type="button">Action</button>}>
        Content
      </Card>
    );

    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('forwards native handlers even when not clickable', () => {
    const handleClick = vi.fn();
    const handleKeyDown = vi.fn();
    const handleKeyUp = vi.fn();

    render(
      <Card onClick={handleClick} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
        Content
      </Card>
    );

    const card = screen.getByText('Content');

    fireEvent.click(card);
    fireEvent.keyDown(card, { key: 'ArrowRight' });

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'ArrowRight' }));
  });
});
