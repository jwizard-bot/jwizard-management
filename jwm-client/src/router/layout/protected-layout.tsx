import * as React from 'react';
import { Outlet } from 'react-router';
import { AppFooter, AppHeader } from '@/component';

const ProtectedLayout: React.FC = (): React.ReactElement => (
  <>
    <AppHeader />
    <Outlet />
    <AppFooter />
  </>
);

export { ProtectedLayout };
