import * as React from 'react';
import { Suspense } from 'react';
import { SuspenseFallback } from '@/component/suspense';

type Props = {
  Fallback?: React.ComponentType;
  children: React.ReactNode;
};

const SuspenseWrapper: React.FC<Props> = ({
  Fallback = SuspenseFallback,
  children,
}): React.ReactElement => <Suspense fallback={<Fallback />}>{children}</Suspense>;

export { SuspenseWrapper };
