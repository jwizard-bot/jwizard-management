import * as React from 'react';
import { SuspenseFallback } from '@/component/suspense';
import { useRevalidateSessionQuery } from '@/redux/api/session/slice';

const AppInitiator: React.FC = (): React.ReactElement | null => {
  const { isLoading } = useRevalidateSessionQuery();

  if (isLoading) {
    return <SuspenseFallback />;
  }

  return null;
};

export { AppInitiator };
