import * as React from 'react';
import { SuspenseFallback } from '@/component';
import { useRevalidateSessionQuery } from '@/redux/api/slice/session-api-slice';

const AppInitiator: React.FC = (): React.ReactElement | null => {
  const { isLoading } = useRevalidateSessionQuery();

  if (isLoading) {
    return <SuspenseFallback />;
  }

  return null;
};

export { AppInitiator };
