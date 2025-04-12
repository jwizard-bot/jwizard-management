import * as React from 'react';
import { Outlet } from 'react-router';

const ProtectedLayout: React.FC = (): React.ReactElement => <Outlet />;

export { ProtectedLayout };
