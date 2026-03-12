import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '../page';
import * as boardsModule from '../queries/boards';
import type { Board, Vendor } from '../queries/boards';

vi.mock('../queries/boards', () => ({
  getBoards: vi.fn(),
}));

vi.mock('../_components/Boards', () => ({
  Boards: ({ vendors, boardsByVendor }: { vendors: Vendor[]; boardsByVendor: Record<string, Board[]> }) => (
    <div data-testid="boards-component">
      <div data-testid="vendor-count">{vendors.length}</div>
      <div data-testid="board-count">
        {Object.values(boardsByVendor).flat().length}
      </div>
    </div>
  ),
}));

const mockVendor: Vendor = { name: 'Test Vendor', slug: 'test-vendor' };
const mockBoards: Board[] = [
  {
    id: '1',
    name: 'Test Board',
    vendor: mockVendor,
    devices: [
      { id: 'd1', name: 'Test Device', processors: [{ core: 'Cortex-M4' }] },
    ],
  },
];

describe('Page', () => {
  it('renders the Boards component', async () => {
    vi.mocked(boardsModule.getBoards).mockResolvedValue(mockBoards);

    const { container } = render(
      await Page({ searchParams: Promise.resolve({}) })
    );
    expect(
      container.querySelector('[data-testid="boards-component"]')
    ).toBeInTheDocument();
  });

  it('passes the correct vendor count to Boards component', async () => {
    vi.mocked(boardsModule.getBoards).mockResolvedValue(mockBoards);

    render(await Page({ searchParams: Promise.resolve({}) }));
    expect(screen.getByTestId('vendor-count')).toHaveTextContent('1');
  });

  it('passes the correct board count to Boards component', async () => {
    vi.mocked(boardsModule.getBoards).mockResolvedValue(mockBoards);

    render(await Page({ searchParams: Promise.resolve({}) }));
    expect(screen.getByTestId('board-count')).toHaveTextContent('1');
  });
});
