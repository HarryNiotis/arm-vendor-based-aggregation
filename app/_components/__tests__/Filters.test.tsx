import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Filters } from '../Filters';
import type { Vendor } from '../../queries/boards';

const vendors: Vendor[] = [
  { name: 'Acme Corp', slug: 'acme-corp' },
  { name: 'Widget Inc', slug: 'widget-inc' },
];

describe('Filters', () => {
  it('renders the heading', () => {
    render(<Filters vendors={vendors} search="" vendor="" onFilter={vi.fn()} />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('renders the Names label and search input', () => {
    render(<Filters vendors={vendors} search="" vendor="" onFilter={vi.fn()} />);
    expect(screen.getByText('Names')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Board or device name')
    ).toBeInTheDocument();
  });

  it('renders the Vendors label and combobox', () => {
    render(<Filters vendors={vendors} search="" vendor="" onFilter={vi.fn()} />);
    expect(screen.getByText('Vendors')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Select a vendor')).toBeInTheDocument();
  });

  it('renders Filter and Reset buttons', () => {
    render(<Filters vendors={vendors} search="" vendor="" onFilter={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  it('initialises with empty search field', () => {
    render(<Filters vendors={vendors} search="" vendor="" onFilter={vi.fn()} />);
    const input = screen.getByPlaceholderText('Board or device name');
    expect(input).toHaveValue('');
  });

  it('initialises search field with provided search prop', () => {
    render(<Filters vendors={vendors} search="raspberry" vendor="" onFilter={vi.fn()} />);
    expect(screen.getByPlaceholderText('Board or device name')).toHaveValue('raspberry');
  });

  it('initialises vendor combobox with provided vendor prop', () => {
    render(<Filters vendors={vendors} search="" vendor="acme-corp" onFilter={vi.fn()} />);
    expect(screen.getByPlaceholderText('Select a vendor')).toHaveValue('Acme Corp');
  });

  it('initialises both search and vendor with provided props', () => {
    render(<Filters vendors={vendors} search="pi" vendor="widget-inc" onFilter={vi.fn()} />);
    expect(screen.getByPlaceholderText('Board or device name')).toHaveValue('pi');
    expect(screen.getByPlaceholderText('Select a vendor')).toHaveValue('Widget Inc');
  });

  it('enables Filter button when search prop is provided', () => {
    render(<Filters vendors={vendors} search="pi" vendor="" onFilter={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Filter' })).not.toBeDisabled();
  });

  it('enables Filter button when vendor prop is provided', () => {
    render(<Filters vendors={vendors} search="" vendor="acme-corp" onFilter={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Filter' })).not.toBeDisabled();
  });

  it('disables Filter button when neither search nor vendor is provided', () => {
    render(<Filters vendors={vendors} search="" vendor="" onFilter={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Filter' })).toBeDisabled();
  });

  it('calls onFilter with search and resolved vendor slug when Filter is clicked', async () => {
    const onFilter = vi.fn();
    render(<Filters vendors={vendors} search="pi" vendor="acme-corp" onFilter={onFilter} />);
    await userEvent.click(screen.getByRole('button', { name: 'Filter' }));
    expect(onFilter).toHaveBeenCalledWith('pi', 'acme-corp');
  });

  it('calls onFilter with empty strings and clears fields when Reset is clicked', async () => {
    const onFilter = vi.fn();
    render(<Filters vendors={vendors} search="pi" vendor="acme-corp" onFilter={onFilter} />);
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onFilter).toHaveBeenCalledWith('', '');
    expect(screen.getByPlaceholderText('Board or device name')).toHaveValue('');
  });

  it('renders the sidebar as an aside element', () => {
    const { container } = render(
      <Filters vendors={vendors} search="" vendor="" onFilter={vi.fn()} />
    );
    expect(container.querySelector('aside')).toBeInTheDocument();
  });
});
