import { withAuthenticationRequired } from '@auth0/auth0-react';
import { createFileRoute } from '@tanstack/react-router';
import ProjectPage from '../../pages/ProjectPage';

export const Route = createFileRoute('/projects/$projectId')({
  component: withAuthenticationRequired(ProjectPage),
});
