import { describe, it, expect, vi } from 'vitest';
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

vi.mock('../_components/Boards', () => ({
  Boards: () => <div data-testid="boards-component" />,
}));

describe('Page', () => {
  it('renders the Boards component', () => {
    render(<Page />);
    expect(screen.getByTestId('boards-component')).toBeInTheDocument();
  });
});
