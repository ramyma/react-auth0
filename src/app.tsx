import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache, createHttpLink, from, fromPromise } from '@apollo/client';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import { onError } from '@apollo/client/link/error';
import { Auth0Provider, type Auth0ProviderOptions, useAuth0 } from '@auth0/auth0-react';
import { RouterProvider } from '@tanstack/react-router';
import { appRouter } from './router';

import './style/app.css';
import { AUTH0_API_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN, GRAPHQL_ENDPOINT } from './constants';

// apollo client tooling
if (process.env.NODE_ENV !== 'production') {
  // adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
});

const httpLink = createHttpLink({ uri: GRAPHQL_ENDPOINT });
const errorLink = onError(({ graphQLErrors, networkError, protocolErrors }) => {
  if (graphQLErrors)
    for (const { message, locations, path } of graphQLErrors) {
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    }

  if (protocolErrors) {
    for (const { message, extensions } of protocolErrors) {
      console.log(`[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(extensions)}`);
    }
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);

    // further network error handling can be added here if needed
  }
});
const generateAuthLink = ({ getAccessTokenSilently, loginWithRedirect, user }: ReturnType<typeof useAuth0>) =>
  new ApolloLink((operation, forward) => {
    return fromPromise(
      getAccessTokenSilently()
        .then((token) => {
          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              authorization: token ? `Bearer ${token}` : '',
            },
          }));
        })
        .catch((e) => {
          console.error(e);
          // Handle an expired token by redirecting the user to login
          if (e.error === 'invalid_grant') {
            loginWithRedirect({
              // set org_id from context to avoid re-prompting the user to check the org
              authorizationParams: { organization: user?.org_id },
              // to preserve current path after login
              appState: { returnTo: window.location.pathname },
            });
            return;
          }
        })
    ).flatMap(() => forward(operation));
  });

function InnerApp() {
  const auth = useAuth0();

  // as the Auth0 provider doesn't expose its client data other than through a hook,
  // it's not ideal to define and update the links here, but it's part of a bigger discussion
  // that would involve different approaches to token propagation (check `useAuth` for a possible alternative).
  const authLink = generateAuthLink(auth);

  client.setLink(from([errorLink, authLink, httpLink]));

  return (
    <ApolloProvider client={client}>
      <RouterProvider router={appRouter} />
    </ApolloProvider>
  );
}

function App() {
  /**
   * Handles redirection to the page the user was on before entering the login flow
   */
  const onRedirectCallback: Auth0ProviderOptions['onRedirectCallback'] = (appState) => {
    appRouter.navigate({
      to: appState?.returnTo || window.location.pathname,
      replace: true,
    });
  };

  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: AUTH0_API_AUDIENCE,
      }}
      onRedirectCallback={onRedirectCallback}
      useRefreshTokens
      cacheLocation="localstorage"
    >
      <InnerApp />
    </Auth0Provider>
  );
}

export default App;
