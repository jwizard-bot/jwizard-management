import * as React from 'react';
import { SuspenseWrapper } from '@/component/suspense';

type Props = {
  Page: React.ComponentType;
  Fallback?: React.ComponentType;
};

const LazyRoute: React.FC<Props> = ({ Page, Fallback }): React.ReactElement => (
  <SuspenseWrapper Fallback={Fallback}>
    <Page />
  </SuspenseWrapper>
);

export { LazyRoute };
