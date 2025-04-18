import * as React from 'react';
import { AuthFooter } from '@/component/auth/auth-footer';
import { Box } from '@mui/material';

type Props = {
  children: React.ReactElement;
};

const AuthContentWrapper: React.FC<Props> = ({ children }): React.ReactElement => (
  <Box display="flex" flexDirection="column" height="100vh">
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      flexGrow={1}
      py={4}>
      {children}
    </Box>
    <AuthFooter />
  </Box>
);

export { AuthContentWrapper };
