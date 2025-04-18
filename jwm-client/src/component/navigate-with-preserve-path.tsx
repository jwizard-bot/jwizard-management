import * as React from 'react';
import { Navigate } from 'react-router';
import { NavigateProps } from 'react-router-dom';

const NavigateWithPreservePath: React.FC<Omit<NavigateProps, 'state'>> = props => (
  <Navigate state={{ from: window.location.pathname }} {...props} />
);

export { NavigateWithPreservePath };
