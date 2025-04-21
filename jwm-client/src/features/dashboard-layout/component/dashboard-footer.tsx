import * as React from 'react';
import { useDeploymentInfo } from '@/hook/use-deployment-info';
import { Box, Link, Typography } from '@mui/material';

const DashboardFooter: React.FC = (): React.ReactElement => {
  const { shortSHA, vcsLink } = useDeploymentInfo();

  return (
    <Box display="flex" justifyContent="center" my={3}>
      <Typography variant="body2">
        Build version:{' '}
        <Link href={vcsLink} target="_blank">
          {shortSHA}
        </Link>
      </Typography>
    </Box>
  );
};

export { DashboardFooter };
