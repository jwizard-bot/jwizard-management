import * as React from 'react';
import { Outlet } from 'react-router';
import { AuthFooter } from '@/component/auth';
import { Box } from '@mui/material';

const AuthFormLayout: React.FC = (): React.ReactElement => (
  <Box display="flex" flexDirection="column" height="100vh">
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      flexGrow={1}
      py={4}>
      <Outlet />
    </Box>
    <AuthFooter />
  </Box>
);

export default AuthFormLayout;
