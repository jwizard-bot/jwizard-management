import * as React from 'react';
import { Outlet } from 'react-router';
import { AppFooter } from '@/component';
import { Box } from '@mui/material';

const UnprotectedLayout: React.FC = (): React.ReactElement => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
    }}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        pt: 4,
        pb: 4,
      }}>
      <Outlet />
    </Box>
    <AppFooter />
  </Box>
);

export { UnprotectedLayout };
