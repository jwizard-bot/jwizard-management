import * as React from 'react';
import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { DashboardLazyRoute, LazyRoute } from '@/router/lazy-route';
import {
  AdminLazyRouteProtector,
  LoggedUserLazyRouteProtector,
  NonLoggedUserLazyRouteProtector,
} from '@/router/route-protector';

const AuthFormLayout = lazy(() => import('@/router/layout/auth-form-layout'));
const DashboardLayout = lazy(() => import('@/router/layout/dashboard-layout'));
const DashboardRootRoute = lazy(() => import('@/router/dashboard-root-route'));

const LoginPage = lazy(() => import('@/page/auth/login'));

const DashboardPage = lazy(() => import('@/page/dashboard'));

const SecuritySessionsPage = lazy(() => import('@/page/security/sessions'));
const SecurityLoginHistoryPage = lazy(() => import('@/page/security/login-history'));
const SecuritySystemEventLogPage = lazy(() => import('@/page/security/system-event-log'));

const AccountSettings = lazy(() => import('@/page/account-settings'));
const AccountSettingsMfa = lazy(() => import('@/page/account-settings/mfa'));

const Users = lazy(() => import('@/page/users'));
const UsersAdd = lazy(() => import('@/page/users/add'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <LazyRoute PageComponent={Outlet} />,
    children: [
      {
        path: '/auth',
        element: <NonLoggedUserLazyRouteProtector PageComponent={AuthFormLayout} />,
        children: [{ path: 'login', element: <LazyRoute PageComponent={LoginPage} /> }],
      },
      {
        path: '/',
        element: <LoggedUserLazyRouteProtector PageComponent={DashboardRootRoute} />,
        children: [
          {
            path: '',
            element: <LazyRoute PageComponent={DashboardLayout} />,
            children: [
              {
                index: true,
                element: <DashboardLazyRoute PageComponent={DashboardPage} />,
              },
              {
                path: '/account-settings',
                element: <DashboardLazyRoute PageComponent={AccountSettings} />,
              },
              {
                path: '/account-settings/mfa',
                element: <DashboardLazyRoute PageComponent={AccountSettingsMfa} />,
              },
              {
                path: '/security/sessions',
                element: <DashboardLazyRoute PageComponent={SecuritySessionsPage} />,
              },
              {
                path: '/security/login-history',
                element: <DashboardLazyRoute PageComponent={SecurityLoginHistoryPage} />,
              },
              {
                path: '/security/system-event-log',
                element: <AdminLazyRouteProtector PageComponent={SecuritySystemEventLogPage} />,
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
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

const AppRouter: React.FC = (): React.ReactElement => <RouterProvider router={router} />;

export { AppRouter };
