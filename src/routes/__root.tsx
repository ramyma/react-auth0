import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import Header from '../components/Header';
import useExpiredRefreshTokenCheck from '../hooks/useExpiredRefreshTokenCheck';

export const Route = createRootRoute({
  component: () => {
    useExpiredRefreshTokenCheck();

    return (
      <div className="flex flex-col">
        <Header />
        <div className="p-5">
          <Outlet />
        </div>
        <TanStackRouterDevtools />
      </div>
    );
  },
});
