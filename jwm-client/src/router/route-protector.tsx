import * as React from 'react';
import { Navigate } from 'react-router';
import { SuspenseFallback, SuspenseWrapper } from '@/component/suspense';
import { MainSliceInitialState, useMainSlice } from '@/redux/store/main-slice';

type Props = {
  redirectTo?: string;
  protectCallback?: (mainState: MainSliceInitialState) => boolean;
  PageComponent: React.ComponentType;
};

const RouteProtector: React.FC<Props> = ({
  redirectTo = '/auth/login',
  protectCallback = ({ loggedUser }) => !!loggedUser,
  PageComponent,
}) => {
  const mainState = useMainSlice();

  if (!mainState.initialized) {
    return <SuspenseFallback />;
  }

  if (protectCallback(mainState)) {
    return (
      <SuspenseWrapper>
        <PageComponent />
      </SuspenseWrapper>
    );
  }

  return <Navigate to={redirectTo} replace />;
};

export { RouteProtector };
