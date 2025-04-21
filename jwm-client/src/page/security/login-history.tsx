import * as React from 'react';
import { DashboardSection } from '@/features/dashboard-layout';
import { Box } from '@mui/material';

const SecurityLoginHistoryPage: React.FC = (): React.ReactElement => (
  <Box>
    <DashboardSection heading="Login history">LOGIN HISTORY</DashboardSection>
  </Box>
);

export default SecurityLoginHistoryPage;
