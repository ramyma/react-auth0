import { useAuth0 } from '@auth0/auth0-react';
import { useContext } from 'react';
import AuthContext from '../AuthProvider';

/**
 * A thin wrapper over useAuth0 to expose token state through `AuthContext`
 *
 * It's not used in the application, but unit tests were added to explore this alternative.
 * Another approach would be to use the AuthContext to tap into the Auth0 client object and expose it
 * outside of the Auth0Provider scope (for access within the Apollo client authLink for instance)
 */
const useAuth = () => {
  const { getAccessTokenSilently, logout, ...auth0 } = useAuth0();
  const { setToken } = useContext(AuthContext);
  const getAccessTokenSilentlyWrapper = async () => {
    const newToken = await getAccessTokenSilently();
    setToken(newToken);

    return newToken;
  };
  const logoutWrapper = async () => {
    setToken(undefined);
    return logout();
  };
  return {
    ...auth0,
    getAccessTokenSilently: getAccessTokenSilentlyWrapper,
    logout: logoutWrapper,
  };
};

export default useAuth;
