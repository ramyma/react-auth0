import { useAuth0 } from '@auth0/auth0-react';
import { Link } from '@tanstack/react-router';
import type { MouseEventHandler } from 'react';
import Button from './Button';

const Header = () => {
  const { isAuthenticated, user, logout, loginWithRedirect, isLoading } = useAuth0();

  const handleLogout: MouseEventHandler = () => logout();
  const handleLogin: MouseEventHandler = () => loginWithRedirect();

  return (
    <div className="flex justify-between h-12 items-center px-5 py-2 border-b border-zinc-300 shadow-lg">
      <div className="flex gap-56">
        <Link to="/">
          <span>Test App</span>
        </Link>
        <ul className="flex gap-2 text-primary-content *:hover:text-neutral-500">
          <li>
            <Link to="/hello" className="data-[status]:bg-accent data-[status]:text-white p-1.5 rounded-lg transition-all">
              Hello
            </Link>
          </li>
          <li>
            <Link to="/projects" className="data-[status]:bg-accent data-[status]:text-white p-1.5 rounded-lg transition-all">
              Projects
            </Link>
          </li>
        </ul>
      </div>
      {!isLoading ? (
        isAuthenticated ? (
          <>
            <div className="dropdown dropdown-end" data-testid="userMenu">
              {user && (
                <button className="avatar w-8 cursor-pointer" tabIndex={0} type="button">
                  <div className="relative flex ring-accent ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2 bg-zinc-500 overflow-hidden">
                    {user.picture && <img src={user.picture} alt="relative user menu" className="z-[2]" />}
                    <span className="z-[1] absolute top-0 left-0 bg-neutral text-neutral-content size-full flex items-center justify-center font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>
              )}

              <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-fit max-w-52 p-2 shadow">
                <li className="pointer-events-none">
                  <span>{user?.email}</span>
                </li>
                <li>
                  <button type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <Button onClick={handleLogin}>Login</Button>
        )
      ) : (
        <div />
      )}
    </div>
  );
};

export default Header;
