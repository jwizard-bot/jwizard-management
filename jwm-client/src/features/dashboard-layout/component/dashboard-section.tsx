import * as React from 'react';
import { Box, Typography } from '@mui/material';

type Props = {
  heading: string;
  children: React.ReactNode;
};

const DashboardSection: React.FC<Props> = ({ heading, children }): React.ReactElement => (
  <Box mb={3}>
    <Typography variant="h5" mb={2}>
      {heading}
    </Typography>
    <Box display="flex" flexDirection="column" gap={3} mb={3}>
      {children}
    </Box>
  </Box>
);

export { DashboardSection };
