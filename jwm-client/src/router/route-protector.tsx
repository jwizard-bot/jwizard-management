import * as React from 'react';
import { NavigateWithPreservePath } from '@/component';
import { DashboardSuspenseFallback, SuspenseFallback, SuspenseWrapper } from '@/component/suspense';
import { useMemoizedPath } from '@/hook/use-memoized-path';
import { MainSliceInitialState, useMainSlice } from '@/redux/store/main-slice';

type Props = {
  redirectTo: (memoizedPath: string) => string;
  protectCallback?: (mainState: MainSliceInitialState) => boolean;
  PageComponent: React.ComponentType;
};

const RouteProtector: React.FC<Props> = ({
  redirectTo,
  protectCallback = () => true,
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

  return <NavigateWithPreservePath to={redirectTo(memoizedPath)} replace />;
};

const LazyRouteProtector: React.FC<Props & { Fallback?: React.ComponentType }> = ({
  Fallback,
  ...rest
}): React.ReactElement => (
  <SuspenseWrapper Fallback={Fallback}>
    <RouteProtector {...rest} />
  </SuspenseWrapper>
);

const NonLoggedUserLazyRouteProtector: React.FC<Omit<Props, 'redirectTo'>> = ({
  protectCallback = () => true,
  ...rest
}): React.ReactElement => (
  <LazyRouteProtector
    redirectTo={memoizedPath => memoizedPath}
    protectCallback={mainState => !mainState.loggedUser && protectCallback(mainState)}
    {...rest}
  />
);

// only for logged user routes
const LoggedUserLazyRouteProtector: React.FC<Omit<Props, 'redirectTo'>> = ({
  protectCallback = () => true,
  ...rest
}): React.ReactElement => (
  <LazyRouteProtector
    redirectTo={() => '/auth/login'}
    protectCallback={mainState => !!mainState.loggedUser && protectCallback(mainState)}
    {...rest}
  />
);

// only for logged as admin user routes
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

export { NonLoggedUserLazyRouteProtector, LoggedUserLazyRouteProtector, AdminLazyRouteProtector };
