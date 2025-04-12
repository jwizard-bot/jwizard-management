import * as React from 'react';
import { SnackbarProvider } from 'notistack';

type Props = {
  children: React.ReactNode;
};

const SnackbarWrapper: React.FC<Props> = ({ children }): React.ReactElement => (
  <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
    {children}
  </SnackbarProvider>
);

export { SnackbarWrapper };
