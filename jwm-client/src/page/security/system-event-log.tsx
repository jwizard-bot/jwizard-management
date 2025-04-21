import * as React from 'react';
import { DashboardSection } from '@/features/dashboard-layout';
import { Box } from '@mui/material';

const SecuritySystemEventLogPage: React.FC = (): React.ReactElement => (
  <Box>
    <DashboardSection heading="System event log">SYSTEM EVENT LOG</DashboardSection>
  </Box>
);

export default SecuritySystemEventLogPage;
