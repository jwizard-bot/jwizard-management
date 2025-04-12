import * as React from 'react';
import { Box, CircularProgress } from '@mui/material';

const SuspenseFallback: React.FC = (): React.ReactElement => (
  <Box
    position="fixed"
    display="flex"
    justifyContent="center"
    alignItems="center"
    width="100%"
    minHeight="100vh">
    <CircularProgress />
  </Box>
);

export { SuspenseFallback };
