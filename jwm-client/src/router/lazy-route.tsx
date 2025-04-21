import * as React from 'react';
import { DashboardSuspenseFallback, SuspenseWrapper } from '@/component/suspense';

type Props = {
  PageComponent: React.ComponentType;
  Fallback?: React.ComponentType;
};

const LazyRoute: React.FC<Props> = ({ PageComponent, Fallback }): React.ReactElement => (
  <SuspenseWrapper key={Date.now()} Fallback={Fallback}>
    <PageComponent />
  </SuspenseWrapper>
);

const DashboardLazyRoute: React.FC<Pick<Props, 'PageComponent'>> = ({
  PageComponent,
}): React.ReactElement => (
  <LazyRoute Fallback={DashboardSuspenseFallback} PageComponent={PageComponent} />
);

export { LazyRoute, DashboardLazyRoute };
