import * as React from 'react';
import { Navigate } from 'react-router';
import { DashboardSuspenseFallback, SuspenseFallback, SuspenseWrapper } from '@/component/suspense';
import { useMemoizedPath } from '@/hook/use-memoized-path';
import { MainSliceInitialState, useMainSlice } from '@/redux/store/main-slice';

type Props = {
  redirectTo?: (mainState: MainSliceInitialState, memoizedPath: string) => string;
  protectCallback?: (mainState: MainSliceInitialState) => boolean;
  PageComponent: React.ComponentType;
};

const RouteProtector: React.FC<Props> = ({
  redirectTo = () => '/auth/login',
  protectCallback = ({ loggedUser }) => !!loggedUser,
  PageComponent,
}): React.ReactElement => {
  const mainState = useMainSlice();
  const memoizedPath = useMemoizedPath();

  if (!mainState.initialized) {
    return <SuspenseFallback />;
  }

  if (protectCallback(mainState)) {
    return <PageComponent />;
  }

  return <Navigate to={redirectTo(mainState, memoizedPath)} replace />;
};

const LazyRouteProtector: React.FC<Props & { Fallback?: React.ComponentType }> = ({
  Fallback,
  ...rest
}): React.ReactElement => (
  <SuspenseWrapper Fallback={Fallback}>
    <RouteProtector {...rest} />
  </SuspenseWrapper>
);

const AdminLazyRouteProtector: React.FC<Pick<Props, 'PageComponent'>> = ({
  PageComponent,
}): React.ReactElement => (
  <LazyRouteProtector
    redirectTo={() => '/'}
    protectCallback={({ loggedUser }) => !!loggedUser?.admin}
    PageComponent={PageComponent}
    Fallback={DashboardSuspenseFallback}
  />
);

export { LazyRouteProtector, AdminLazyRouteProtector };
