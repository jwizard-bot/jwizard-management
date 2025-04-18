import * as React from 'react';
import { Outlet } from 'react-router';
import { AuthContentWrapper } from '@/component/auth';

const AuthFormLayout: React.FC = (): React.ReactElement => (
  <AuthContentWrapper>
    <Outlet />
  </AuthContentWrapper>
);

export default AuthFormLayout;
