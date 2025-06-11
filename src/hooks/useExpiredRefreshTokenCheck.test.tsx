import * as Auth0React from '@auth0/auth0-react';
import * as ReactRouter from '@tanstack/react-router';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import useExpiredRefreshTokenCheck from './useExpiredRefreshTokenCheck';

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal()),
  useLocation: () => ({ pathname: 'test' }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: null,
    logout: vi.fn(),
    loginWithRedirect: vi.fn(),
    isLoading: false,
    getAccessTokenSilently: vi.fn(),
  }),
}));

const TestComponent = () => {
  useExpiredRefreshTokenCheck();
  return <div />;
};

describe('useExpiredRefreshTokenCheck', () => {
  it('calls loginWithRedirectMock when getAccessTokenSilently fails with invalid_grant', async () => {
    const getAccessTokenSilentlyMock = vi.fn().mockRejectedValueOnce({ error: 'invalid_grant' }).mockResolvedValueOnce(undefined);

    const loginWithRedirectMock = vi.fn();

    const defaultAuth0 = Auth0React.useAuth0();

    vi.spyOn(Auth0React, 'useAuth0').mockImplementation(() => ({
      ...defaultAuth0,
      isAuthenticated: true,
      isLoading: false,
      getAccessTokenSilently: getAccessTokenSilentlyMock,
      loginWithRedirect: loginWithRedirectMock,
    }));

    const { rerender } = render(<TestComponent />);

    expect(getAccessTokenSilentlyMock).toHaveBeenCalledOnce();
    await waitFor(() => expect(loginWithRedirectMock).toHaveBeenCalledTimes(1));

    getAccessTokenSilentlyMock.mockReset();
    const defaultLocation = ReactRouter.useLocation();
    vi.spyOn(ReactRouter, 'useLocation').mockImplementation(() => ({
      ...defaultLocation,
      pathname: 'test2',
    }));

    rerender(<TestComponent />);

    await waitFor(() => expect(getAccessTokenSilentlyMock).toHaveBeenCalledOnce());
  });
});
