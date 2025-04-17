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
        <DashboardSideBar sidebarWidth={260} />
        <Box component="main" flexGrow={1}>
          <Toolbar />
          <Box sx={{ m: { xs: 2, md: 4 } }}>
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
