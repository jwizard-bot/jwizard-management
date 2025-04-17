import * as React from 'react';
import logo from '@/assets/logo.svg';
import { Box, Card, CardContent, Typography } from '@mui/material';

type Props = {
  caption: string;
  children: React.ReactNode;
};

const AuthCardWrapper: React.FC<Props> = ({ caption, children }): React.ReactElement => (
  <Card
    sx={{
      width: '100%',
      maxWidth: 400,
      p: 1,
    }}>
    <CardContent>
      <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
        <img src={logo} alt="" width={70} />
        <Box display="flex" flexDirection="column" alignItems="center" gap={1} mb={2}>
          <Typography variant="h5" component="h1" fontWeight="medium" align="center">
            JWizard Management Panel
          </Typography>
          <Typography variant="caption" textAlign="center" color="textSecondary">
            {caption}
          </Typography>
        </Box>
      </Box>
      {children}
    </CardContent>
  </Card>
);

export { AuthCardWrapper };
