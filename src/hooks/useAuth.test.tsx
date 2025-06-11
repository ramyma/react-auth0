import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { type PropsWithChildren, useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';
import AuthProvider from '../AuthProvider';
import authState from '../authState';
import useAuth from './useAuth';

const TEST_TOKEN_VALUE = 'test_token_value';

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: null,
    logout: vi.fn(),
    loginWithRedirect: vi.fn(),
    isLoading: false,
    getAccessTokenSilently: vi.fn().mockResolvedValue(TEST_TOKEN_VALUE),
  }),
}));

const TestComponent = () => {
  const { getAccessTokenSilently, logout } = useAuth();
  useEffect(() => {
    getAccessTokenSilently();
  });
  return (
    <div>
      <button onClick={() => logout()} type="button">
        Logout
      </button>
    </div>
  );
};

describe('useAuth', () => {
  it('set token to context authState when getAccessTokenSilently is called', async () => {
    render(<TestComponent />, {
      wrapper: ({ children }: PropsWithChildren) => <AuthProvider value={authState}>{children}</AuthProvider>,
    });

    await waitFor(() => expect(authState.getToken()).toEqual(TEST_TOKEN_VALUE));
  });
  it('clear token from context authState when logout is called', async () => {
    render(<TestComponent />, {
      wrapper: ({ children }: PropsWithChildren) => <AuthProvider value={authState}>{children}</AuthProvider>,
    });

    expect(authState.getToken()).not.toBeUndefined();

    fireEvent.click(screen.getByText(/logout/i));

    expect(authState.getToken()).toBeUndefined();
  });
});
