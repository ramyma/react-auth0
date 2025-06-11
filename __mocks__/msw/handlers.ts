import * as jose from 'jose';
import { HttpResponse, graphql } from 'msw';
import type { StrictRequest } from 'msw';

import type { ProjectQueryReturn } from '../../src/pages/ProjectPage/ProjectPage';
import type { ProjectsQueryReturn } from '../../src/pages/ProjectsPage/ProjectsPage';
import { getProjectsOrgData } from './projectsData';

export const handlers = [
  graphql.query<ProjectsQueryReturn>('GetProjects', ({ request }) => {
    const token = extractTokenFromRequestHeaders(request);
    if (!token) {
      return HttpResponse.json(
        {
          errors: [{ message: 'Request failed' }],
        },
        { status: 401 }
      );
    }
    const claims = jose.decodeJwt(token);

    const projectsOrgData = getProjectsOrgData(claims.org_id as string);

    return HttpResponse.json({
      data: {
        projects: Object.values(projectsOrgData),
      },
    });
  }),
  graphql.query<ProjectQueryReturn, { id: string }>('GetProject', ({ variables, request }) => {
    const token = extractTokenFromRequestHeaders(request);

    if (!token) {
      return HttpResponse.json(
        {
          errors: [{ message: 'Request failed' }],
        },
        { status: 401 }
      );
    }
    const claims = jose.decodeJwt(token);
    const projectsOrgData = getProjectsOrgData(claims.org_id as string);

    return HttpResponse.json({
      data: { project: projectsOrgData?.[variables.id] ?? null },
    });
  }),
];

const extractTokenFromRequestHeaders = (request: StrictRequest<null>) => request.headers.get('authorization')?.replace('Bearer ', '') ?? '';
