import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as jose from 'jose';
import { HttpResponse, graphql } from 'msw';
import type { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ORG_1, org1ProjectsData } from '../../../__mocks__/msw/projectsData';
import { server } from '../../../__mocks__/msw/server';
import { GRAPHQL_ENDPOINT } from '../../constants';
import ProjectPage, { type ProjectQueryReturn } from './index';

const PROJECT_ID = Object.keys(org1ProjectsData)[0];
const TOKEN = new jose.UnsecuredJWT({ org_id: ORG_1 })
  .setIssuedAt()
  .setIssuer('urn:example:issuer')
  .setAudience('urn:example:audience')
  .setExpirationTime('2h')
  .encode();

vi.mock('../../routes/projects/$projectId', async (importOriginal) => ({
  ...(await importOriginal()),
  Route: {
    useParams: () => ({ projectId: PROJECT_ID }),
  },
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal()),
  useLocation: () => ({ pathname: 'test' }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

const AllTheProviders = ({ children }: PropsWithChildren) => {
  return (
    <ApolloProvider
      client={
        new ApolloClient({
          // TODO: refactor
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

describe('Project Page', () => {
  it('should load project', async () => {
    render(<ProjectPage />, { wrapper: AllTheProviders });

    await waitFor(() => expect(screen.getAllByText(org1ProjectsData[PROJECT_ID].name)).toHaveLength(2));
  });
  it('should show error on query failure', async () => {
    server.use(
      graphql.query<ProjectQueryReturn>(
        'GetProject',
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

    render(<ProjectPage />, { wrapper: AllTheProviders });

    await waitFor(() => expect(screen.getByText(/failed/i)));
    const retryButton = screen.getByText(/retry/i);
    fireEvent.click(retryButton);

    await waitFor(() => expect(screen.getAllByText(org1ProjectsData[PROJECT_ID].name)).toHaveLength(2));
  });
});
