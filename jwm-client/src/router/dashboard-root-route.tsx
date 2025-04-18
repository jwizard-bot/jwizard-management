import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContentWrapper } from '@/component/auth';
import { DialogProvider } from '@/component/dialog';
import { ChangeDefaultPasswordForm } from '@/features/change-default-password';
import { useMainSlice } from '@/redux/store/main-slice';

// render on top of the dashboard layout, for full-page blocked actions
const DashboardRootRoute: React.FC = (): React.ReactElement => {
  const { loggedUser, skippedChangeDefaultPassword } = useMainSlice();

  if (loggedUser?.hasDefaultPassword && !skippedChangeDefaultPassword) {
    return (
      <DialogProvider>
        <AuthContentWrapper>
          <ChangeDefaultPasswordForm />
        </AuthContentWrapper>
      </DialogProvider>
    );
  }

  return <Outlet />;
};

export default DashboardRootRoute;
