import * as React from 'react';
import { lazy } from 'react';
import { Navigate } from 'react-router';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ProtectedLayout } from '@/router/layout/protected-layout';
import { UnprotectedLayout } from '@/router/layout/unprotected-layout';
import { RootLayout } from '@/router/root-layout';
import { RouteProtector } from '@/router/route-protector';

const LoginPage = lazy(() => import('@/page/login-page'));
const RootPage = lazy(() => import('@/page/root-page'));
const ChangeDefaultPasswordPage = lazy(() => import('@/page/change-default-password-page'));

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
            PageComponent={UnprotectedLayout}
          />
        ),
        children: [{ path: 'login', element: <LoginPage /> }],
      },
      {
        path: '/change-default-password',
        element: (
          <RouteProtector
            protectCallback={({ loggedUser }) => !!loggedUser?.hasDefaultPassword}
            PageComponent={UnprotectedLayout}
          />
        ),
        children: [{ index: true, element: <ChangeDefaultPasswordPage /> }],
      },
      {
        path: '/',
        element: <RouteProtector PageComponent={ProtectedLayout} />,
        children: [{ path: '/', element: <RootPage /> }],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

const AppRouter: React.FC = (): React.ReactElement => <RouterProvider router={router} />;

export { AppRouter };
