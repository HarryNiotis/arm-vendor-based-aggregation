import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Filters } from '../Filters';
import type { Vendor } from '../../queries/boards';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

const vendors: Vendor[] = [
  { name: 'Acme Corp', slug: 'acme-corp' },
  { name: 'Widget Inc', slug: 'widget-inc' },
];

describe('Filters', () => {
  it('renders the heading', () => {
    render(<Filters vendors={vendors} onFilter={vi.fn()} />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('renders the Names label and search input', () => {
    render(<Filters vendors={vendors} onFilter={vi.fn()} />);
    expect(screen.getByText('Names')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Board or device name')
    ).toBeInTheDocument();
  });

  it('renders the Vendors label and combobox', () => {
    render(<Filters vendors={vendors} onFilter={vi.fn()} />);
    expect(screen.getByText('Vendors')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Select a vendor')).toBeInTheDocument();
  });

  it('renders Filter and Reset buttons', () => {
    render(<Filters vendors={vendors} onFilter={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  it('initialises with empty search field', () => {
    render(<Filters vendors={vendors} onFilter={vi.fn()} />);
    const input = screen.getByPlaceholderText('Board or device name');
    expect(input).toHaveValue('');
  });

  it('renders the sidebar as an aside element', () => {
    const { container } = render(
      <Filters vendors={vendors} onFilter={vi.fn()} />
    );
    expect(container.querySelector('aside')).toBeInTheDocument();
  });
});
