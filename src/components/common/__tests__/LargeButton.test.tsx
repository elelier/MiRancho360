import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LargeButton } from '../LargeButton';

describe('LargeButton', () => {
  it('renders primary large button by default', () => {
    render(<LargeButton>Action</LargeButton>);

    const button = screen.getByRole('button', { name: 'Action' });

    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'large');
    expect(button.className).toContain('bg-primary-700');
    expect(button.className).toContain('min-h-[48px]');
  });

  it('supports xl size and full width layout', () => {
    render(
      <LargeButton size="xl" fullWidth>
        Submit
      </LargeButton>
    );

    const button = screen.getByRole('button', { name: 'Submit' });

    expect(button).toHaveAttribute('data-size', 'xl');
    expect(button.className).toContain('min-h-[60px]');
    expect(button.className).toContain('w-full');
  });

  it('renders icon in the requested position', () => {
    const icon = <span data-testid="icon">?</span>;

    const { rerender } = render(
      <LargeButton icon={icon} iconPosition="left">
        With Icon
      </LargeButton>
    );

    const button = screen.getByRole('button', { name: 'With Icon' });
    const content = button.querySelector('[data-slot="content"]');

    expect(content?.firstElementChild?.querySelector('[data-testid="icon"]')).not.toBeNull();
    expect(content?.lastElementChild?.querySelector('[data-testid="icon"]')).toBeNull();

    rerender(
      <LargeButton icon={icon} iconPosition="right">
        With Icon
      </LargeButton>
    );

    const updatedContent = button.querySelector('[data-slot="content"]');

    expect(updatedContent?.lastElementChild?.querySelector('[data-testid="icon"]')).not.toBeNull();
    expect(updatedContent?.firstElementChild?.querySelector('[data-testid="icon"]')).toBeNull();
  });

  it('shows loading state with spinner and disables interactions', () => {
    render(
      <LargeButton isLoading icon={<span data-testid="icon">?</span>}>
        Loading
      </LargeButton>
    );

    const button = screen.getByRole('button', { name: /Loading/ });

    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    expect(button.querySelector('svg')).not.toBeNull();
    expect(screen.queryByTestId('icon')).toBeNull();
  });
});
