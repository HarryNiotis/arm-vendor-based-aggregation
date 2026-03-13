import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useSuspenseQuery } from '@apollo/client/react';
import { Boards } from '../Boards';
import type { Board } from '../../queries/boards';

vi.mock('@apollo/client/react', () => ({
  useSuspenseQuery: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
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
  });

  it('renders the Filters sidebar', () => {
    render(<Boards />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('renders the Results section', () => {
    render(<Boards />);
    expect(screen.getByText('Devices by Vendor')).toBeInTheDocument();
  });

  it('renders vendor names in results', () => {
    render(<Boards />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Widget Inc')).toBeInTheDocument();
  });
});
