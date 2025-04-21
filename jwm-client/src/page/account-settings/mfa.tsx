import * as React from 'react';
import { DashboardSection, DashboardSectionSeparator } from '@/features/dashboard-layout';
import { Box } from '@mui/material';

const UserSettingsMfaPage: React.FC = (): React.ReactElement => (
  <Box>
    <DashboardSection heading="MFA provider">MFA PROVIDER</DashboardSection>
    <DashboardSectionSeparator />
    <DashboardSection heading="Authenticator provider settings">
      AUTHENTICATION PROVIDER SETTINGS
    </DashboardSection>
  </Box>
);

export default UserSettingsMfaPage;
