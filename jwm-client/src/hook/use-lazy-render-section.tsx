import * as React from 'react';
import { useCallback } from 'react';
import { SuspenseFallback } from '@/component/suspense';

const useLazyRenderSection = (dependsFrom: boolean) =>
  useCallback(
    (Section: React.ComponentType) => (!dependsFrom ? <SuspenseFallback /> : <Section />),
    [dependsFrom]
  );

export { useLazyRenderSection };
