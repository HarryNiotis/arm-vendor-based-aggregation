import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useSuspenseQuery } from '@apollo/client/react';
import { Boards } from '../Boards';
import type { Board } from '../../queries/boards';
import type { FiltersProps } from '../Filters';

vi.mock('@apollo/client/react', () => ({
  useSuspenseQuery: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const mockFilters = vi.fn();
vi.mock('../Filters', () => ({
  Filters: (props: FiltersProps) => {
    mockFilters(props);
    return <aside><h2>Filters</h2></aside>;
  },
}));

const mockBoards: Board[] = [
  {
    id: '1',
    name: 'Board Alpha',
    vendor: { name: 'Acme Corp', slug: 'acme-corp' },
    devices: [
      { id: 'd1', name: 'Device A', processors: [{ core: 'Cortex-M4' }] },
    ],
  },
  {
    id: '2',
    name: 'Board Beta',
    vendor: { name: 'Widget Inc', slug: 'widget-inc' },
    devices: [],
  },
];

describe('Boards', () => {
  beforeEach(() => {
    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: { boards: mockBoards },
    } as ReturnType<typeof useSuspenseQuery>);
    mockFilters.mockClear();
  });

  it('renders the Filters sidebar', () => {
    render(<Boards search="" vendor="" />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('renders the Results section', () => {
    render(<Boards search="" vendor="" />);
    expect(screen.getByText('Devices by Vendor')).toBeInTheDocument();
  });

  it('renders vendor names in results', () => {
    render(<Boards search="" vendor="" />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Widget Inc')).toBeInTheDocument();
  });

  it('passes empty search and vendor props to Filters', () => {
    render(<Boards search="" vendor="" />);
    expect(mockFilters).toHaveBeenCalledWith(
      expect.objectContaining({ search: '', vendor: '' }),
    );
  });

  it('passes search prop to Filters', () => {
    render(<Boards search="raspberry" vendor="" />);
    expect(mockFilters).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'raspberry', vendor: '' }),
    );
  });

  it('passes vendor prop to Filters', () => {
    render(<Boards search="" vendor="acme-corp" />);
    expect(mockFilters).toHaveBeenCalledWith(
      expect.objectContaining({ search: '', vendor: 'acme-corp' }),
    );
  });

  it('passes both search and vendor props to Filters', () => {
    render(<Boards search="pi" vendor="widget-inc" />);
    expect(mockFilters).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'pi', vendor: 'widget-inc' }),
    );
  });
});
