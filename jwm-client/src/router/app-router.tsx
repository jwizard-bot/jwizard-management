import * as React from 'react';
import { lazy } from 'react';
import { Navigate } from 'react-router';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { DashboardSuspenseFallback } from '@/component/suspense';
import { LazyRoute } from '@/router/lazy-route';
import { RootLayout } from '@/router/root-layout';
import { LazyRouteProtector } from '@/router/route-protector';

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
    element: <RootLayout />,
    children: [
      {
        path: '/auth',
        element: (
          <LazyRouteProtector
            protectCallback={({ loggedUser }) => !loggedUser}
            redirectTo="/"
            PageComponent={AuthFormLayout}
          />
        ),
        children: [{ path: 'login', element: <LoginPage /> }],
      },
      {
        path: '/change-default-password',
        element: (
          <LazyRouteProtector
            protectCallback={({ loggedUser }) => !!loggedUser}
            PageComponent={AuthFormLayout}
          />
        ),
        children: [{ index: true, element: <ChangeDefaultPasswordPage /> }],
      },
      {
        path: '/',
        element: <LazyRouteProtector PageComponent={DashboardLayout} />,
        children: [
          { index: true, element: <DashboardPage /> },
          {
            path: '/user-settings',
            element: <LazyRoute Fallback={DashboardSuspenseFallback} Page={UserSettings} />,
          },
          {
            path: '/user-settings/mfa',
            element: <LazyRoute Fallback={DashboardSuspenseFallback} Page={UserSettingsMfa} />,
          },
          {
            path: '/users',
            element: (
              <LazyRouteProtector
                redirectTo="/"
                protectCallback={({ loggedUser }) => !loggedUser?.admin}
                PageComponent={Users}
                Fallback={DashboardSuspenseFallback}
              />
            ),
          },
          {
            path: '/users/add',
            element: (
              <LazyRouteProtector
                redirectTo="/"
                protectCallback={({ loggedUser }) => !loggedUser?.admin}
                PageComponent={UsersAdd}
                Fallback={DashboardSuspenseFallback}
              />
            ),
          },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

const AppRouter: React.FC = (): React.ReactElement => <RouterProvider router={router} />;

export { AppRouter };
