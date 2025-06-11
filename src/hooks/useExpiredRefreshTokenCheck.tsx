import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Checks if refresh token is valid on load and on router path change, redirects to login page if refresh token is expired
 */
const useExpiredRefreshTokenCheck = () => {
  const { getAccessTokenSilently, loginWithRedirect, isLoading, isAuthenticated, user } = useAuth0();

  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState(location);

  // flag to prevent triggering the token check twice
  const hasAlreadyChecked = useRef(false);

  const checkTokenIfNeeded = useCallback(async () => {
    if (!isLoading && isAuthenticated && !hasAlreadyChecked.current && prevLocation.pathname) {
      hasAlreadyChecked.current = true;

      try {
        await getAccessTokenSilently();
      } catch (e) {
        // handle expired refresh token by redirecting the user to login
        // @ts-ignore: non standart Error type
        if (e.error === 'invalid_grant') {
          loginWithRedirect({
            // set org_id from context to avoid re-prompting the user to check the org
            authorizationParams: { organization: user?.org_id },
            // to preserve current path after login
            appState: { returnTo: window.location.pathname },
          });
        } else {
          console.error(e);
        }
      }
    }
  }, [getAccessTokenSilently, loginWithRedirect, isLoading, isAuthenticated, prevLocation.pathname, user]);

  useEffect(() => {
    checkTokenIfNeeded();
  }, [checkTokenIfNeeded]);

  // check if router path has changed
  if (location.pathname !== prevLocation.pathname) {
    // reset token check flag
    hasAlreadyChecked.current = false;

    // update the prevLocation value; effectively triggering a token check
    setPrevLocation(location);
  }
};

export default useExpiredRefreshTokenCheck;
