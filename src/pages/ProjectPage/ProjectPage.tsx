import { useQuery } from '@apollo/client';
import { Link } from '@tanstack/react-router';
import Alert from '../../components/Alert';
import { Route } from '../../routes/projects/$projectId';
import type { Project as ProjectType } from '../ProjectsPage';
import { GET_PROJECT } from './queries';

export type ProjectQueryReturn = { project: ProjectType };

const ProjectPage = () => {
  const { projectId } = Route.useParams();
  const {
    error,
    data,
    refetch,
    loading: _loading,
  } = useQuery<ProjectQueryReturn>(GET_PROJECT, {
    variables: { id: projectId },
    fetchPolicy: 'cache-and-network',
  });

  if (error)
    return (
      <Alert type="error" actions={[{ label: 'Retry', onClick: () => refetch() }]}>
        Request Failed
      </Alert>
    );

  return (
    <div className="flex flex-col gap-2">
      <div className="breadcrumbs text-sm border-b border-zinc-200">
        <ul>
          <li>
            <Link to="/projects">Projects</Link>
          </li>
          <li className="font-bold">{data?.project?.name}</li>
        </ul>
      </div>
      <div className="flex flex-col py-2 gap-2">
        <h2 className="prose-xl">{data?.project?.name}</h2>
        <p>{data?.project?.description}</p>
      </div>
    </div>
  );
};

export default ProjectPage;
