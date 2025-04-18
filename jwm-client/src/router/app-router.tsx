import * as React from 'react';
import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { DashboardLazyRoute, LazyRoute } from '@/router/lazy-route';
import { AdminLazyRouteProtector, LazyRouteProtector } from '@/router/route-protector';

const AuthFormLayout = lazy(() => import('@/router/layout/auth-form-layout'));
const DashboardLayout = lazy(() => import('@/router/layout/dashboard-layout'));

const LoginPage = lazy(() => import('@/page/auth/login'));
const ChangeDefaultPasswordPage = lazy(() => import('@/page/change-default-password'));
const DashboardPage = lazy(() => import('@/page/dashboard'));
const UserSettings = lazy(() => import('@/page/user-settings'));
const UserSettingsMfa = lazy(() => import('@/page/user-settings/mfa'));
const Users = lazy(() => import('@/page/users'));
const UsersAdd = lazy(() => import('@/page/users/add'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <LazyRoute Page={Outlet} />,
    children: [
      {
        path: '/auth',
        element: (
          <LazyRouteProtector
            protectCallback={({ loggedUser }) => !loggedUser}
            redirectTo={() => '/'}
            PageComponent={AuthFormLayout}
          />
        ),
        children: [{ path: 'login', element: <LazyRoute Page={LoginPage} /> }],
      },
      {
        path: '/change-default-password',
        element: (
          <LazyRouteProtector
            protectCallback={({ loggedUser, skippedChangeDefaultPassword }) =>
              !!loggedUser && !!loggedUser?.hasDefaultPassword && !skippedChangeDefaultPassword
            }
            redirectTo={({ loggedUser }, memoizedPath) =>
              loggedUser ? memoizedPath : '/auth/login'
            }
            PageComponent={AuthFormLayout}
          />
        ),
        children: [{ index: true, element: <LazyRoute Page={ChangeDefaultPasswordPage} /> }],
      },
      {
        path: '/',
        element: <LazyRouteProtector PageComponent={DashboardLayout} />,
        children: [
          {
            index: true,
            element: <DashboardLazyRoute Page={DashboardPage} />,
          },
          {
            path: '/user-settings',
            element: <DashboardLazyRoute Page={UserSettings} />,
          },
          {
            path: '/user-settings/mfa',
            element: <DashboardLazyRoute Page={UserSettingsMfa} />,
          },
          {
            path: '/users',
            element: <AdminLazyRouteProtector PageComponent={Users} />,
          },
          {
            path: '/users/add',
            element: <AdminLazyRouteProtector PageComponent={UsersAdd} />,
          },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

const AppRouter: React.FC = (): React.ReactElement => <RouterProvider router={router} />;

export { AppRouter };
