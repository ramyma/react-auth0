import { useQuery } from '@apollo/client';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { Link } from '@tanstack/react-router';
import Alert from '../../components/Alert';
import { GET_PROJECTS } from './queries';

export type Project = {
  id: string;
  name: string;
  description: string;
};

export type ProjectsQueryReturn = { projects: Project[] };

const ProjectsPage = () => {
  const { error, data, refetch } = useQuery<ProjectsQueryReturn>(GET_PROJECTS, {
    fetchPolicy: 'cache-and-network',
  });

  return (
    <div className="flex flex-col gap-5">
      <h2 className="prose-2xl">Projects</h2>
      {error ? (
        <Alert type="error" actions={[{ label: 'Retry', onClick: () => refetch() }]}>
          Request Failed
        </Alert>
      ) : (
        <ul className="inline-flex gap-4 flex-wrap">
          {data?.projects?.map(({ id, name }) => (
            <li key={id} className="group card w-96 shadow-lg border border-zinc-300">
              <Link to="/projects/$projectId" params={{ projectId: id }}>
                <div className="card-body">
                  <h3 className="card-title">{name}</h3>
                  <div className="card-actions justify-end">
                    <button className="btn btn-soft" type="button">
                      <ArrowRightIcon className="size-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectsPage;
