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

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/auth',
        element: (
          <RouteProtector
            transformFc={loggedIn => !loggedIn}
            redirectTo="/"
            PageComponent={UnprotectedLayout}
          />
        ),
        children: [{ path: 'login', element: <LoginPage /> }],
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
