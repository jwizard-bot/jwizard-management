import * as React from 'react';
import { DashboardSuspenseFallback, SuspenseWrapper } from '@/component/suspense';

type Props = {
  Page: React.ComponentType;
  Fallback?: React.ComponentType;
};

const LazyRoute: React.FC<Props> = ({ Page, Fallback }): React.ReactElement => (
  <SuspenseWrapper key={Date.now()} Fallback={Fallback}>
    <Page />
  </SuspenseWrapper>
);

const DashboardLazyRoute: React.FC<Pick<Props, 'Page'>> = ({ Page }): React.ReactElement => (
  <LazyRoute Fallback={DashboardSuspenseFallback} Page={Page} />
);

export { LazyRoute, DashboardLazyRoute };
