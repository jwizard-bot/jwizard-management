import * as React from 'react';
import { Box, CircularProgress } from '@mui/material';

const DashboardSuspenseFallback: React.FC = (): React.ReactElement => (
  <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
    <CircularProgress />
  </Box>
);

export { DashboardSuspenseFallback };
