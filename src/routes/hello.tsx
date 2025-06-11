import { createFileRoute } from '@tanstack/react-router';
import HelloPage from '../pages/HelloPage';

export const Route = createFileRoute('/hello')({
  component: HelloPage,
});
