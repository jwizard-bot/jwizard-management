import { useLocation } from 'react-router';

const useMemoizedPath = (defaultPath: string = '/'): string => {
  const location = useLocation();
  return location.state?.from || defaultPath;
};

export { useMemoizedPath };
