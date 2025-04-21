import * as React from 'react';
import { Box } from '@mui/material';
import { BoxProps } from '@mui/material/Box';

type Props = {
  children: React.ReactNode;
} & Omit<BoxProps, 'maxWidth' | 'width'>;

const SafetyFormWrapper: React.FC<Props> = ({ children, ...rest }): React.ReactElement => (
  <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 350 } }} {...rest}>
    {children}
  </Box>
);

export { SafetyFormWrapper };
