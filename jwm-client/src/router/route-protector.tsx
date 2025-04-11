import * as React from 'react';
import { Navigate } from 'react-router';
import { SuspenseFallback } from '@/component';
import { useMainSlice } from '@/redux/slice/main-slice';

type Props = {
  redirectTo?: string;
  transformFc?: (loggedIn: boolean) => boolean;
  PageComponent: React.ComponentType;
};

const RouteProtector: React.FC<Props> = ({
  redirectTo = '/auth/login',
  transformFc = loggedIn => loggedIn,
  PageComponent,
}) => {
  const { loggedIn, initialized } = useMainSlice();

  if (!initialized) {
    return <SuspenseFallback />;
  }

  if (transformFc(loggedIn)) {
    return <PageComponent />;
  }

  return <Navigate to={redirectTo} replace />;
};

export { RouteProtector };
