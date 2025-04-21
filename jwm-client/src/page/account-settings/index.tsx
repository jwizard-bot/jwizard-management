import * as React from 'react';
import { SystemAlert } from '@/component';
import { DashboardSection, DashboardSectionSeparator } from '@/features/dashboard-layout';
import { AccountEmailForm, ChangePasswordForm } from '@/features/user-settings';
import { Box } from '@mui/material';

const UserSettings: React.FC = (): React.ReactElement => (
  <Box>
    <DashboardSection heading="Account email">
      <SystemAlert severity="info">
        Email account is used only for forget-password and MFA authentication. If your account has
        not set email address, you could not be able to change forgotten password or set MFA email
        provider.
      </SystemAlert>
      <AccountEmailForm />
    </DashboardSection>
    <DashboardSectionSeparator />
    <DashboardSection heading="Update password">
      <ChangePasswordForm />
    </DashboardSection>
  </Box>
);

export default UserSettings;
