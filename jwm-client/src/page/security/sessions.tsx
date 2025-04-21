import * as React from 'react';
import { DashboardSection, DashboardSectionSeparator } from '@/features/dashboard-layout';
import { Box } from '@mui/material';

const SecuritySessionsPage: React.FC = (): React.ReactElement => (
  <Box>
    <DashboardSection heading="Current session">CURRENT SESSION</DashboardSection>
    <DashboardSectionSeparator />
    <DashboardSection heading="All sessions">ALL SESSIONS</DashboardSection>
  </Box>
);

export default SecuritySessionsPage;
