import * as React from 'react';
import { Outlet } from 'react-router';
import { DialogProvider } from '@/component/dialog';
import {
  DashboardFooter,
  DashboardLogoutModal,
  DashboardSideBar,
  DashboardTopBar,
} from '@/features/dashboard-layout';
import { Box, Divider, Toolbar } from '@mui/material';

const DashboardLayout: React.FC = (): React.ReactElement => (
  <Box display="flex">
    <DialogProvider>
      <DashboardTopBar />
      <Box display="flex" width="100%">
        <DashboardSideBar sidebarWidth={280} />
        <Box component="main" flexGrow={1} display="flex" flexDirection="column" minHeight="100vh">
          <Toolbar />
          <Box flexGrow={1} sx={{ m: { xs: 2, md: 4 } }}>
            <Outlet />
          </Box>
          <Divider />
          <DashboardFooter />
        </Box>
      </Box>
      <DashboardLogoutModal />
    </DialogProvider>
  </Box>
);

export default DashboardLayout;
