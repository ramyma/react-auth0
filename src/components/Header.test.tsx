import * as Auth0React from '@auth0/auth0-react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Header from './Header';

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal()),
  useLocation: () => ({ pathname: 'test' }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: false,
    user: null,
    logout: vi.fn(),
    loginWithRedirect: vi.fn(),
    isLoading: false,
  }),
}));

describe('Header', () => {
  it('should render without errors', () => {
    const loginMock = vi.fn();

    const defaultAuth0 = Auth0React.useAuth0();

    vi.spyOn(Auth0React, 'useAuth0').mockImplementationOnce(() => ({
      ...defaultAuth0,
      loginWithRedirect: loginMock,
    }));

    render(<Header />);

    const loginButton = screen.getByText(/login/i);
    expect(loginButton).toBeInTheDocument();
    expect(screen.queryByTestId('userMenu')).not.toBeInTheDocument();

    fireEvent.click(loginButton);

    expect(loginMock).toHaveBeenCalledOnce();
  });

  it('should render logged in view correctly', () => {
    const logoutMock = vi.fn();

    const defaultAuth0 = Auth0React.useAuth0();

    vi.spyOn(Auth0React, 'useAuth0').mockImplementationOnce(() => ({
      ...defaultAuth0,
      isAuthenticated: true,
      user: { name: 'user', email: 'user@email.com', picture: 'test' },
      logout: logoutMock,
    }));

    render(<Header />);

    const logoutButton = screen.getByText(/logout/i);
    expect(logoutButton).toBeInTheDocument();
    expect(screen.getByTestId('userMenu')).toBeInTheDocument();
    fireEvent.click(logoutButton);

    expect(logoutMock).toHaveBeenCalledOnce();
  });

  it('should render user menu when logged in and auth info is loaded', () => {
    const defaultAuth0 = Auth0React.useAuth0();
    vi.spyOn(Auth0React, 'useAuth0').mockImplementationOnce(() => ({
      ...defaultAuth0,
      isAuthenticated: true,
      isLoading: true,
    }));
    const { rerender } = render(<Header />);
    expect(screen.queryByTestId('userMenu')).not.toBeInTheDocument();

    vi.spyOn(Auth0React, 'useAuth0').mockImplementationOnce(() => ({
      ...defaultAuth0,
      isAuthenticated: true,
      isLoading: false,
    }));

    rerender(<Header />);

    expect(screen.getByTestId('userMenu')).toBeInTheDocument();
  });
});
