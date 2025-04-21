import * as React from 'react';
import { Box, CircularProgress } from '@mui/material';

const SectionDataSuspense: React.FC = (): React.ReactElement => (
  <Box display="flex" justifyContent="center" width="100%" my={4}>
    <CircularProgress size={30} />
  </Box>
);

export { SectionDataSuspense };
