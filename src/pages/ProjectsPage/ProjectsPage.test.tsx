import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as jose from 'jose';
import { HttpResponse, graphql } from 'msw';
import type { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ORG_1 } from '../../../__mocks__/msw/projectsData';
import { server } from '../../../__mocks__/msw/server';
import { GRAPHQL_ENDPOINT } from '../../constants';
import ProjectsPage, { type ProjectsQueryReturn } from './index';

const TOKEN = new jose.UnsecuredJWT({ org_id: ORG_1 })
  .setIssuedAt()
  .setIssuer('urn:example:issuer')
  .setAudience('urn:example:audience')
  .setExpirationTime('2h')
  .encode();

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal()),
  useLocation: () => ({ pathname: 'test' }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

// TODO: refactor to a reusable space
const AllTheProviders = ({ children }: PropsWithChildren) => {
  return (
    <ApolloProvider
      client={
        new ApolloClient({
          uri: GRAPHQL_ENDPOINT,
          cache: new InMemoryCache(),
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        })
      }
    >
      {children}
    </ApolloProvider>
  );
};

describe('Projects Page', () => {
  it('should load projects', async () => {
    render(<ProjectsPage />, { wrapper: AllTheProviders });

    await waitFor(() => expect(screen.getByText(/krypton/i)).toBeInTheDocument());
  });
  it('should show error on query failure', async () => {
    server.use(
      graphql.query<ProjectsQueryReturn>(
        'GetProjects',
        () => {
          return HttpResponse.json(
            {
              errors: [{ message: 'Request failed' }],
            },
            { status: 401 }
          );
        },
        { once: true }
      )
    );

    render(<ProjectsPage />, { wrapper: AllTheProviders });
    // const welcomeText = screen.getByText(/welcome/i);
    await waitFor(() => expect(screen.getByText(/failed/i)).toBeInTheDocument());
    const retryButton = screen.getByText(/retry/i);
    fireEvent.click(retryButton);

    await waitFor(() => expect(screen.getByText(/krypton/i)).toBeInTheDocument());
  });
});
