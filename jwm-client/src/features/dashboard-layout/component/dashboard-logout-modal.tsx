import * as React from 'react';
import { ConfirmationDialog } from '@/component/dialog';
import { useLogoutMutation } from '@/redux/api/auth/slice';

const DashboardLogoutModal: React.FC = (): React.ReactElement => {
  const [logout, { isLoading }] = useLogoutMutation();

  return (
    <ConfirmationDialog
      title="Logout from account"
      loading={isLoading}
      onSubmit={async (): Promise<void> => {
        await logout();
      }}>
      Are you sure to logout from your account? All unsaved changed will be dropped.
    </ConfirmationDialog>
  );
};

export { DashboardLogoutModal };
