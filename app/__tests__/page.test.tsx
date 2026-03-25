import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '../page';

vi.mock('@/api/ApolloClient', () => ({
  PreloadQuery: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('../queries/boards', () => ({
  GET_BOARDS: {},
}));

import type { BoardsProps } from '../_components/Boards';

const mockBoards = vi.fn();
vi.mock('../_components/Boards', () => ({
  Boards: (props: BoardsProps) => {
    mockBoards(props);
    return <div data-testid="boards-component" />;
  },
}));

describe('Page', () => {
  beforeEach(() => {
    mockBoards.mockClear();
  });

  it('renders the Boards component', async () => {
    render(await Page({ searchParams: Promise.resolve({}) }));
    expect(screen.getByTestId('boards-component')).toBeInTheDocument();
  });

  it('passes empty search and vendor when searchParams is empty', async () => {
    render(await Page({ searchParams: Promise.resolve({}) }));
    expect(mockBoards).toHaveBeenCalledWith(
      expect.objectContaining({ search: '', vendor: '' }),
    );
  });

  it('passes decoded search prop to Boards', async () => {
    render(await Page({ searchParams: Promise.resolve({ search: 'raspberry%20pi' }) }));
    expect(mockBoards).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'raspberry pi', vendor: '' }),
    );
  });

  it('passes decoded vendor prop to Boards', async () => {
    render(await Page({ searchParams: Promise.resolve({ vendor: 'acme-corp' }) }));
    expect(mockBoards).toHaveBeenCalledWith(
      expect.objectContaining({ search: '', vendor: 'acme-corp' }),
    );
  });

  it('passes both decoded search and vendor props to Boards', async () => {
    render(await Page({ searchParams: Promise.resolve({ search: 'pi', vendor: 'widget-inc' }) }));
    expect(mockBoards).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'pi', vendor: 'widget-inc' }),
    );
  });
});
