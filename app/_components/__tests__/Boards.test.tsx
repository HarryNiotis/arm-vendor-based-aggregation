import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Boards } from '../Boards';
import type { Vendor, Board } from '../../queries/boards';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

const vendors: Vendor[] = [
  { name: 'Acme Corp', slug: 'acme-corp' },
  { name: 'Widget Inc', slug: 'widget-inc' },
];

const boardsByVendor: Record<string, Board[]> = {
  'acme-corp': [
    {
      id: '1',
      name: 'Board Alpha',
      vendor: vendors[0],
      devices: [
        { id: 'd1', name: 'Device A', processors: [{ core: 'Cortex-M4' }] },
      ],
    },
  ],
  'widget-inc': [
    {
      id: '2',
      name: 'Board Beta',
      vendor: vendors[1],
      devices: [],
    },
  ],
};

describe('Boards', () => {
  it('renders the Filters sidebar', () => {
    render(<Boards vendors={vendors} boardsByVendor={boardsByVendor} />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('renders the Results section', () => {
    render(<Boards vendors={vendors} boardsByVendor={boardsByVendor} />);
    expect(screen.getByText('Devices by Vendor')).toBeInTheDocument();
  });

  it('renders vendor names in results', () => {
    render(<Boards vendors={vendors} boardsByVendor={boardsByVendor} />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Widget Inc')).toBeInTheDocument();
  });
});
