import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SwipeAction } from '../SwipeAction';

describe('SwipeAction', () => {
  it('reveals right actions and triggers action handlers', async () => {
    const onDelete = vi.fn();
    const onOpenChange = vi.fn();

    const { container } = render(
      <SwipeAction
        rightActions={[{
          id: 'delete',
          label: 'Eliminar',
          intent: 'delete',
          onPress: onDelete
        }]}
        onOpenChange={onOpenChange}
      >
        <div className="p-4">Registro #1</div>
      </SwipeAction>
    );

    const root = container.querySelector('[data-component="swipe-action"]') as HTMLElement;
    const content = root.querySelector('[data-slot="content"]') as HTMLElement;

    content.focus();
    fireEvent.keyDown(content, { key: 'ArrowRight' });

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith('right'));
    expect(root.dataset.openSide).toBe('right');

    const deleteButton = screen.getByRole('button', { name: 'Eliminar' });
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(null));
    expect(root.dataset.openSide).toBe('');
  });

  it('opens fallback menu via button and executes selected action', async () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <SwipeAction
        leftActions={[{
          id: 'edit',
          label: 'Editar',
          intent: 'edit',
          onPress: onEdit
        }]}
        rightActions={[{
          id: 'delete',
          label: 'Eliminar',
          intent: 'delete',
          onPress: onDelete
        }]}
      >
        <div className="p-4">Acción</div>
      </SwipeAction>
    );

    const user = userEvent.setup();
    const fallbackButton = screen.getByRole('button', { name: 'Acciones' });

    await user.click(fallbackButton);

    const editFromMenu = screen.getByRole('menuitem', { name: 'Editar' });
    await user.click(editFromMenu);

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('supports keyboard navigation to open and close swipe states', () => {
    const onOpenChange = vi.fn();

    const { container } = render(
      <SwipeAction
        leftActions={[{
          id: 'edit',
          label: 'Editar',
          intent: 'edit',
          onPress: vi.fn()
        }]}
        rightActions={[{
          id: 'delete',
          label: 'Eliminar',
          intent: 'delete',
          onPress: vi.fn()
        }]}
        onOpenChange={onOpenChange}
      >
        <div className="p-4">Elemento</div>
      </SwipeAction>
    );

    const root = container.querySelector('[data-component="swipe-action"]') as HTMLElement;
    const content = root.querySelector('[data-slot="content"]') as HTMLElement;

    content.focus();
    fireEvent.keyDown(content, { key: 'ArrowLeft' });

    expect(root.dataset.openSide).toBe('left');

    fireEvent.keyDown(content, { key: 'Escape' });

    expect(root.dataset.openSide).toBe('');
    expect(onOpenChange).toHaveBeenCalledWith('left');
    expect(onOpenChange).toHaveBeenCalledWith(null);
  });
});
