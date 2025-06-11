import { withAuthenticationRequired } from '@auth0/auth0-react';
import { createFileRoute } from '@tanstack/react-router';
import ProjectsPage from '../../pages/ProjectsPage';

export const Route = createFileRoute('/projects/')({
  component: withAuthenticationRequired(ProjectsPage),
});
