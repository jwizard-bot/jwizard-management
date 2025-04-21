import * as React from 'react';
import { Alert } from '@mui/material';
import { AlertProps } from '@mui/material/Alert';

type Props = Omit<AlertProps, 'variant'>;

const SystemAlert: React.FC<Props> = ({ children, ...rest }): React.ReactElement => (
  <Alert variant="filled" {...rest}>
    {children}
  </Alert>
);

export { SystemAlert };
