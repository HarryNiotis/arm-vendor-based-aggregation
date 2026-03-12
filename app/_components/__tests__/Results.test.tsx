import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Results } from '../Results';
import type { Vendor, Board } from '../../queries/boards';

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
        { id: 'd2', name: 'Device B', processors: [{ core: 'Cortex-M7' }] },
      ],
    },
    {
      id: '3',
      name: 'Board Gamma',
      vendor: vendors[0],
      devices: [
        { id: 'd3', name: 'Device C', processors: [{ core: 'Cortex-A53' }] },
      ],
    },
  ],
  'widget-inc': [
    {
      id: '2',
      name: 'Board Beta',
      vendor: vendors[1],
      devices: [
        { id: 'd4', name: 'Device D', processors: [{ core: 'Cortex-M0' }] },
      ],
    },
  ],
};

describe('Results', () => {
  it('renders the section heading', () => {
    render(<Results vendors={vendors} boardsByVendor={boardsByVendor} />);
    expect(screen.getByText('Devices by Vendor')).toBeInTheDocument();
  });

  it('renders all vendor names', () => {
    render(<Results vendors={vendors} boardsByVendor={boardsByVendor} />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Widget Inc')).toBeInTheDocument();
  });

  it('renders board count badges for each vendor', () => {
    render(<Results vendors={vendors} boardsByVendor={boardsByVendor} />);
    expect(screen.getByText('2 Boards')).toBeInTheDocument(); // Acme Corp
    expect(screen.getByText('1 Boards')).toBeInTheDocument(); // Widget Inc
  });

  it('renders board names after expanding a vendor accordion', async () => {
    render(<Results vendors={vendors} boardsByVendor={boardsByVendor} />);
    // Expand the Acme Corp accordion
    await userEvent.click(screen.getByText('Acme Corp'));
    expect(screen.getByText('Board Alpha')).toBeInTheDocument();
    expect(screen.getByText('Board Gamma')).toBeInTheDocument();
  });

  it('renders device count badges after expanding a vendor', async () => {
    render(<Results vendors={vendors} boardsByVendor={boardsByVendor} />);
    await userEvent.click(screen.getByText('Acme Corp'));
    expect(screen.getByText('2 Devices')).toBeInTheDocument(); // Board Alpha
    expect(screen.getByText('1 Devices')).toBeInTheDocument(); // Board Gamma
  });

  it('shows empty state when no vendors provided', () => {
    render(<Results vendors={[]} boardsByVendor={{}} />);
    expect(
      screen.getByText('No results found. Try adjusting your filters.')
    ).toBeInTheDocument();
  });

  it('filters out vendors with no boards', () => {
    const emptyBoardsByVendor: Record<string, Board[]> = {
      'acme-corp': [],
      'widget-inc': [
        {
          id: '2',
          name: 'Board Beta',
          vendor: vendors[1],
          devices: [],
        },
      ],
    };
    render(<Results vendors={vendors} boardsByVendor={emptyBoardsByVendor} />);
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument();
    expect(screen.getByText('Widget Inc')).toBeInTheDocument();
  });
});
