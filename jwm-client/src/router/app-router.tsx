import * as React from 'react';
import { lazy } from 'react';
import { Navigate } from 'react-router';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/router/root-layout';
import { RouteProtector } from '@/router/route-protector';

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
          <RouteProtector
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
          <RouteProtector
            protectCallback={({ loggedUser }) => !!loggedUser?.hasDefaultPassword}
            PageComponent={AuthFormLayout}
          />
        ),
        children: [{ index: true, element: <ChangeDefaultPasswordPage /> }],
      },
      {
        path: '/',
        element: <RouteProtector PageComponent={DashboardLayout} />,
        children: [
          { index: true, element: <DashboardPage /> },
          {
            path: '/user-settings',
            element: <UserSettings />,
          },
          {
            path: '/user-settings/mfa',
            element: <UserSettingsMfa />,
          },
          {
            path: '/users',
            element: <Users />,
          },
          {
            path: '/users/add',
            element: <UsersAdd />,
          },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

const AppRouter: React.FC = (): React.ReactElement => <RouterProvider router={router} />;

export { AppRouter };
