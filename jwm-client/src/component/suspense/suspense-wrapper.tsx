import * as React from 'react';
import { Suspense } from 'react';
import { SuspenseFallback } from '@/component/suspense/suspense-fallback.tsx';

type Props = {
  children: React.ReactNode;
};

const SuspenseWrapper: React.FC<Props> = ({ children }): React.ReactElement => (
  <Suspense fallback={<SuspenseFallback />}>{children}</Suspense>
);

export { SuspenseWrapper };
