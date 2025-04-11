import * as React from 'react';
import { Outlet } from 'react-router';
import { AppFooter } from '@/component';

const UnprotectedLayout: React.FC = (): React.ReactElement => (
  <>
    <Outlet />
    <AppFooter />
  </>
);

export { UnprotectedLayout };
